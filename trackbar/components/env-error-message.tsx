import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Badge } from "./ui/badge";

const EnvErrorMessage = () => {
  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
        </div>
      </>
    );
  }
  return null;
};

export default EnvErrorMessage;
