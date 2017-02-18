import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import graphql.ExecutionResult;
import graphql.GraphQL;
import graphql.schema.GraphQLObjectType;
import graphql.schema.GraphQLSchema;

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
            ExecutionResult executionResult =
                    graphql.execute(payload.get("query").toString(), null, null, variables);
            Map<String, Object> result = new LinkedHashMap<>();
            if (executionResult.getErrors().size() > 0) {
                result.put("errors", executionResult.getErrors());
            }
            result.put("data", executionResult.getData());
            response.type("application/json");
            return result;
        });
    }
}

