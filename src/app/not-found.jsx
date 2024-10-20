
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <img
          src="/logo.svg"
          width={300}
          height={300}
          alt="404 Error"
          className="mx-auto"
        />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Oops, looks like you've drifted off course!
        </h1>
        <p className="mt-4 text-muted-foreground">
          It looks like you've wandered into the unknown. Don't worry, we'll help you find your way back home.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            Take me back to Earth
          </Link>
        </div>
      </div>
    </div>
  )
}