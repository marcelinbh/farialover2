import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Header() {
  return (
    <header className="header-fixed">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center">
              <img src="/logo.png" alt="farialover" className="h-12 md:h-16" />
            </a>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                HOME
              </a>
            </Link>
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                MODELOS
              </a>
            </Link>
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                CIDADES
              </a>
            </Link>
            <Link href="/videos">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                VÍDEOS
              </a>
            </Link>
            <Link href="/audios">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                ÁUDIOS
              </a>
            </Link>
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                ATUALIZAÇÕES
              </a>
            </Link>
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                SERVIÇOS
              </a>
            </Link>
            <Link href="/depoimentos">
              <a className="text-foreground hover:text-primary transition-colors font-medium">
                DEPOIMENTOS
              </a>
            </Link>
            <Link href="/">
              <a className="btn-gradient px-4 py-2 rounded-md text-sm">
                ANUNCIE AQUI
              </a>
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
