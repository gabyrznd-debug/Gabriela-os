import { ComingSoon } from "@/components/ui";

export default function Page() {
  return (
    <ComingSoon
      title="Dashboard Marketing & Tráfego"
      responsavel="leitura — Admin, Gerente, Marketing, Tráfego"
      telas={["Orgânico x pago lado a lado", "CPL, custo por lead qualificado, CAC, ROAS", "Melhores conteúdos e campanhas"]}
    />
  );
}
