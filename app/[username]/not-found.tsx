import Link from "next/link";

export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold text-quokka-purple mb-4">
        User Not Found
      </h1>
      <p className="text-xl mb-8">
        Sorry, we couldn&apos;t find the user you&apos;re looking for.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-quokka-purple text-white rounded-lg hover:bg-quokka-purple/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
