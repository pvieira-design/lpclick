# Depoimentos aprovados para novas páginas

Decisão do usuário em 24/09/2026: nas próximas páginas, utilizar exclusivamente os relatos classificados como “Manter integral” e “Com corte” na triagem das 122 avaliações. As versões com cortes propostas nessa triagem foram autorizadas para uso futuro.

## Base de uso

Importar `APPROVED_TESTIMONIALS` de `@/lib/approvedTestimonials`.

A base contém 112 relatos: 77 integrais e 35 excertos. Cada registro contém nome, texto final aprovado, foto, tags, data original, versão (`full`/`excerpt`) e ID da avaliação no relatório histórico. Os textos foram copiados e congelados para que alterações na base bruta não reintroduzam trechos excluídos.

```tsx
import { APPROVED_TESTIMONIALS } from "@/lib/approvedTestimonials";

const reviews = APPROVED_TESTIMONIALS.slice(0, 10);
```

- Selecionar um subconjunto conforme a página; não é necessário exibir todos.
- Usar o campo `text` exatamente como salvo. Preservar `[…]` nos excertos.
- Não importar `TEXT_TESTIMONIALS` de LP4/LP5 para uma nova página nem copiar listas antigas ao clonar uma LP. Adaptar o componente clonado para esta base.
- Não preencher lugares vagos com relatos da base original. Os 9 classificados como “Deixar de fora” e Fabio sá (autoria pendente) não integram a seleção.
- Didi da Silva e Suze Costa são incluídos apenas nas versões cortadas aprovadas, recuperadas do histórico. Não restaurar seus textos integrais.
- Arthur Marques deve usar a versão com omissão da afirmação de cura.
- Manter as decisões expressas do usuário, inclusive Verista Convicto. A aprovação é editorial, não comprova afirmações médicas dos relatos.
- Não alterar nome, foto, data, autoria ou atribuir condições que não aparecem no relato. Tags legadas não substituem a leitura do texto.
- Se houver necessidade de outra edição ou de um novo depoimento, apresentar para aprovação antes de acrescentar à base.

## Limites desta alteração

Esta regra vale para as próximas páginas. Não migra automaticamente páginas existentes nem muda as seleções já publicadas da bio/LP13. A base bruta histórica continua separada para referência.

A `/inicio` foi ligada explicitamente a esta base em 24/09/2026. Sua seleção foi ampliada para 32 relatos na página: oito sobre sono e seis para cada um dos outros quatro objetivos. O pop-up mostra até quatro relatos do objetivo escolhido. Os cards da página e do pop-up leem os mesmos textos congelados daqui. Didi da Silva e Suze Costa seguem fora da seleção da `/inicio`, conforme decisão anterior do usuário.

Os vídeos ainda não têm transcrição localizada. Não criar citações a partir de resumos ou metadados; seguir o plano de transcrição e revisão antes de aprovar conteúdo derivado de vídeo. Não atribuir a esses futuros trechos origem Google ou estrelas inventadas.

## Rastreabilidade

- Triagem completa: `reports/depoimentos/triagem-122-avaliacoes-2026-09-24.md`.
- Dados da triagem: `reports/depoimentos/triagem-122-avaliacoes-2026-09-24.json`.
- Universo histórico: 122 avaliações no commit `d905917`.
- A base bruta local continha 120 no momento da análise; os dois ausentes foram recuperados somente para a triagem e a seleção aprovada.
