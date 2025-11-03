export default function Footer() {
  return (
    <footer className="h-14 w-full bg-background">
      <div className="w-full h-full px-6 flex justify-center items-center">
        <div className="text-muted-foreground w-full px-1 text-center text-xs leading-loose sm:text-sm">
          Built by
          <a
            className="ml-1 font-medium underline underline-offset-4"
            href="https://github.com/wizley9999"
            target="_blank"
          >
            Wizley
          </a>
          . The source code is available on
          <a
            className="ml-1 font-medium underline underline-offset-4"
            href="https://github.com/wizley9999/hanaldual"
            target="_blank"
          >
            GitHub
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
