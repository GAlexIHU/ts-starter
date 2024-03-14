import { useParams } from "react-router-dom";
import { z } from "zod";
import { getClient } from "../api-client";

const paramSchema = z.object({
  id: z.string(),
});

const client = getClient();

function Error() {
  const val = useParams();
  const { id } = paramSchema.parse(val);

  const { data, isLoading, error } = client.example.get.useQuery(
    [id],
    {
      params: { id },
    },
    {
      queryKey: [id],
      retry(failureCount, err) {
        if (err.status >= 500) {
          return failureCount < 3;
        }
        return false;
      },
    },
  );

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-semibold ">
          Showing fetched data for &quot;{id}&quot;
        </h1>
        <pre className="px-8 mb-4 text-lg text-gray-600 text-justify">
          {!isLoading && JSON.stringify(data, null, 2)}
        </pre>
        {
          // Show error message if there is an error
          error && (
            <pre className="px-8 mb-4 text-lg text-red-500 text-justify">
              {JSON.stringify(error.body, null, 2)}
            </pre>
          )
        }
      </div>
    </div>
  );
}

export default Error;
