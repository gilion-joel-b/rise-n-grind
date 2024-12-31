import { useProfileContext } from "@/components/context/context"
import { LoginModal } from "../login-modal"
import { LogoutModal } from "../logout-modal"

export function Profile() {
  const { person } = useProfileContext()

  return (
    person?.name ?
      <LogoutModal /> :
      <LoginModal />
  )
}
