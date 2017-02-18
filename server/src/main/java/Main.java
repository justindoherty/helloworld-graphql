import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.GraphQLObjectType;
import graphql.schema.GraphQLSchema;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import static graphql.Scalars.GraphQLString;
import static graphql.schema.GraphQLFieldDefinition.newFieldDefinition;
import static graphql.schema.GraphQLObjectType.newObject;
import static spark.Spark.*;

public class Main {
    static ThreadLocal<ObjectMapper> mapper = ThreadLocal.withInitial(() ->
            new ObjectMapper().registerModule(new Jdk8Module())
                    .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false));

    public static void main(String[] args) {
        Main.enableCORS("http://localhost:4200", "POST", "");
        GraphQLObjectType queryType = newObject()
                .name("helloWorldQuery")
                .field(newFieldDefinition()
                        .type(GraphQLString)
                        .name("hello")
                        .staticValue("world"))
                .build();

        GraphQLSchema schema = GraphQLSchema.newSchema()
                .query(queryType)
                .build();

        GraphQL graphql = new GraphQL(schema);

        post("/", (request, response) -> {
            Map<String, Object> payload;
            payload = mapper.get().readValue(request.body(), Map.class);
            Map<String,Object> variables =
                    (Map<String, Object>) payload.get("variables");
            if (variables == null) {
                variables = Collections.emptyMap();
            }
            ExecutionResult executionResult =
                    graphql.execute(payload.get("query").toString(), null, null, variables);
            Map<String, Object> result = new LinkedHashMap<>();
            if (executionResult.getErrors().size() > 0) {
                result.put("errors", executionResult.getErrors());
            }
            result.put("data", executionResult.getData());
            response.type("application/json");
            return mapper.get().writeValueAsString(result);
        });
    }

    private static void enableCORS(final String origin, final String methods, final String headers) {

        options("/*", (request, response) -> {

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", origin);
            response.header("Access-Control-Request-Method", methods);
            response.header("Access-Control-Allow-Headers", headers);
            // Note: this may or may not be necessary in your particular application
            response.type("application/json");
        });
    }
}

