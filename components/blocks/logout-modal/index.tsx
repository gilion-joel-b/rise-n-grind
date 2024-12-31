import { useProfileContext } from "@/components/context/context"
import { Button } from "@/components/ui/button"
import { DialogHeader } from "@/components/ui/dialog"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog"
import { deleteCookie } from "cookies-next"

export function LogoutModal() {
  const { setPerson } = useProfileContext()
  return (
    <Dialog>
      <DialogTrigger className="absolute top-4 right-4 capitalize">logout</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout?</DialogTitle>
          <DialogDescription>
            Logout from current account here
          </DialogDescription>
          <Button onClick={() => {
            deleteCookie("rng_player")
            setPerson(null)
          }}>Logout</Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

