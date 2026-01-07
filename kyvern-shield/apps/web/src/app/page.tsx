import { redirect } from "next/navigation";

/**
 * Kyvern Shield Root Page
 *
 * Users should access Kyvern Shield from kyvernlabs.com
 * This page redirects to the dashboard directly.
 */
export default function HomePage() {
  redirect("/dashboard");
}
