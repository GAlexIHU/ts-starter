import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-semibold ">Home</h1>
        <p className="mb-4 text-lg text-gray-600">
          Pass a parameter to the URL to see info fetched from backend.
        </p>
        {/* search bar that redirects to page */}
        <form
          className="flex w-full items-center space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            navigate(`/${(e.target as any)?.id?.value}`);
          }}
        >
          <Input type="search" name="id" placeholder="Search" />
          <Button type="submit">Go!</Button>
        </form>
      </div>
    </div>
  );
}

export default Landing;
