import {Button} from "@/components/ui/button"
import {Card, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Link} from "react-router";

const ErrorPage = () => {
  return (
    <section className="flex flex-col min-h-screen">
      <main className="flex justify-center items-center flex-1">
        <Card className="w-full max-w-sm mx-5">
          <CardHeader>
            <CardTitle className="text-center">Opps!</CardTitle>
            <CardDescription className="text-center">
              An Error Occurs
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/"> Go to Home page</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </section>
  );
};

export default ErrorPage;