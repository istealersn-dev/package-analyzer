"use client";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-4xl py-6">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground">
              Licensed under{" "}
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                MIT
              </a>
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Made by</span>
            <a
              href="https://www.linkedin.com/in/stanleyjnadar/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Stanley J
            </a>
                        <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
              className="w-5 h-5 mx-1"
              aria-label="India Flag"
            >
              <path fill="#FF9933" d="M0 4.8h36v7.2H0z"/>
              <path fill="#FFF" d="M0 12h36v7.2H0z"/>
              <path fill="#138808" d="M0 19.2h36v7.2H0z"/>
              <circle fill="#000080" cx="18" cy="15.6" r="2.4"/>
              <path fill="#000080" d="M18 13.2c-.3 0-.6.1-.8.2.9.3 1.6 1.2 1.6 2.2s-.7 1.9-1.6 2.2c.2.1.5.2.8.2 1.3 0 2.4-1.1 2.4-2.4s-1.1-2.4-2.4-2.4z"/>
            </svg>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Files are not stored on our servers</p>
          </div>
        </div>
      </div>
    </footer>
  );
}