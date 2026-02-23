import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const AGE_VERIFICATION_COOKIE = "farialover_age_verified";

export default function AgeVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    // Check if user has already verified age
    const verified = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${AGE_VERIFICATION_COOKIE}=`));

    if (!verified) {
      setIsOpen(true);
    }
  }, []);

  const handleEnter = () => {
    if (!agreed) return;

    if (remember) {
      // Set cookie for 30 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      document.cookie = `${AGE_VERIFICATION_COOKIE}=true; expires=${expiryDate.toUTCString()}; path=/`;
    }

    setIsOpen(false);
  };

  const handleExit = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl bg-black/95 border-2 border-primary text-white"
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>Verificação de Idade</DialogTitle>
        </VisuallyHidden>
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold">
              18+
            </div>
            <div>
              <h2 className="text-2xl font-bold">FARIALOVER</h2>
              <p className="text-sm text-gray-400">
                Controle de acesso • Conteúdo adulto
              </p>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold">
            Acesso restrito ao público adulto
          </h3>

          {/* Warning text */}
          <p className="text-sm text-gray-300">
            Antes de continuar, confirme as declarações abaixo. Este acesso é
            destinado exclusivamente a maiores de 18 anos.
          </p>

          {/* Warning box */}
          <div className="bg-red-950/30 border border-red-500 rounded-lg p-4">
            <p className="text-sm text-red-200">
              Para sua segurança e conformidade, o FARIALOVER utiliza este aviso
              de maioridade e responsabilidade de uso.
            </p>
          </div>

          {/* Declarations */}
          <div className="space-y-4 text-sm">
            <p>
              <span className="font-semibold">1.</span> Declaro possuir mais de
              18 anos e que, em meu país, essa maioridade me permite acessar
              este tipo de conteúdo do site FARIALOVER.
            </p>
            <p>
              <span className="font-semibold">2.</span> Declaro estar ciente que
              o material exposto no site FARIALOVER é de conteúdo adulto, que
              estou acessando para uso pessoal e não irei expor este conteúdo a
              menores de 18 anos ou a outros com restrição legal ou moral.
            </p>
            <p>
              <span className="font-semibold">3.</span> Assumo inteira
              responsabilidade civil, criminal e demais legislações pertinentes
              pelo uso indevido dos materiais fotográficos, vídeos e outros
              existentes no site FARIALOVER, uma vez que as veiculações dos
              anúncios não representam cessão de direitos de imagem aos
              visitantes e usuários.
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="border-primary data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="agree"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Li e concordo com as declarações acima.
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked as boolean)}
                className="border-primary data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Lembrar minha escolha por 30 dias (cookie).
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-gray-600 hover:bg-gray-800"
              onClick={handleExit}
            >
              Sair do site
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={handleEnter}
              disabled={!agreed}
            >
              Entrar no FARIALOVER
            </Button>
          </div>

          {/* Footer links */}
          <div className="flex justify-center gap-6 text-xs text-gray-400">
            <a href="/termos" className="hover:text-primary transition-colors">
              Termos e condições
            </a>
            <a
              href="/privacidade"
              className="hover:text-primary transition-colors"
            >
              Privacidade
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
