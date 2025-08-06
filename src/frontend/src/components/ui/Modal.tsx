import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const Modal = ({
  text,
  action,
  className = "",
}: {
  text: string;
  action: any;
  className?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const executeAction = async () => {
    setIsLoading(true);
    await action();
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={className}>
        {text}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-50">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="text-slate-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction disabled={isLoading} onClick={executeAction}>
            {isLoading && <Loader2 className="animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
