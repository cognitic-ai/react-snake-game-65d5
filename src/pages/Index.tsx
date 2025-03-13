import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
const Index = () => {
  return (
    <div className="container mx-auto min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Welcome!</CardTitle>
          <CardDescription className="text-center">Choose a game to play</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Link to="/snake">
              <Button className="w-full text-lg py-6" size="lg">
                🐍 Play Snake
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-center text-muted-foreground">
          Use arrow keys or WASD to control the snake
        </CardFooter>
      </Card>
    </div>
  );
};

export default Index;