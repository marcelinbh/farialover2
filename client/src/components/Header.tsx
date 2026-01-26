import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Header() {
  return (
    <header className="header-fixed">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/farialover-logo-new.png" alt="farialover" className="h-12 md:h-16" />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              HOME
            </Link>
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              MODELOS
            </Link>
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              CIDADES
            </Link>
            <Link href="/videos" className="text-foreground hover:text-primary transition-colors font-medium">
              VÍDEOS
            </Link>
            <Link href="/audios" className="text-foreground hover:text-primary transition-colors font-medium">
              ÁUDIOS
            </Link>
            <Link href="/contato" className="btn-gradient px-4 py-2 rounded-md text-sm">
              CONTATO
            </Link>
          </nav>

          {/* Redes Sociais */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">
              <Instagram size={20} />
            </a>
          </div>

          {/* Menu Mobile (TODO) */}
          <button className="md:hidden text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
