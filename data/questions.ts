import { Question } from '../types';

export const ALL_QUESTIONS: Question[] = [
  // Parte I
  { id: 'P1_A_1', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 1, text: 'Data e localização do navio quando a limpeza proativa ocorreu.' },
  { id: 'P1_A_2', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 2, text: 'Observações gerais em relação ao bioincrustação antes da limpeza, se houver (ou seja, extensão do microincrustação e macroincrustação de acordo com as classificações definidas).' },
  { id: 'P1_A_3', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 3, text: 'Registros de permissões necessárias para realizar a limpeza proativa em água, se aplicável.' },
  { id: 'P1_A_4', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 4, text: 'Detalhes do casco e áreas de nicho limpas.' },
  { id: 'P1_A_5', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 5, text: 'Observações gerais em relação à bioincrustação após a limpeza, se houver (ou seja, extensão do microincrustação e macroincrustação de acordo com as classificações definidas).' },
  { id: 'P1_A_6', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 6, text: 'Referência a qualquer evidência/apresentação de relatórios da limpeza (por exemplo, relatório do fornecedor, fotografias/vídeos e/ou recibos), se houver.' },
  { id: 'P1_A_7', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 7, text: 'Método, fabricante e modelo do método de limpeza proativa utilizado, se não fornecido no BFMP.' },
  { id: 'P1_A_8', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 8, text: 'Referência ao padrão de teste para o qual o método foi testado, se não fornecido no BFMP.' },
  { id: 'P1_A_9', category: 'Parte I - Item A: Limpeza Proativa', code: 'A', number: 9, text: 'Nome, cargo e assinatura da pessoa responsável pela atividade.' },
  
  { id: 'P1_B_1', category: 'Parte I - Item B: Inspeção', code: 'B', number: 1, text: 'Data e localização da inspeção' },
  { id: 'P1_B_2', category: 'Parte I - Item B: Inspeção', code: 'B', number: 2, text: 'Métodos utilizados para a inspeção (incluindo ferramentas/dispositivos).' },
  { id: 'P1_B_3', category: 'Parte I - Item B: Inspeção', code: 'B', number: 3, text: 'Áreas inspecionadas do navio' },
  { id: 'P1_B_4', category: 'Parte I - Item B: Inspeção', code: 'B', number: 4, text: 'Observações em relação à bioincrustação (extensão da microincrustação e macroincrustação de acordo com as taxas de incrustação definidas).' },
  { id: 'P1_B_5', category: 'Parte I - Item B: Inspeção', code: 'B', number: 5, text: 'Observações em relação ao estado do sistema anti-incrustante (AFS)' },
  { id: 'P1_B_6', category: 'Parte I - Item B: Inspeção', code: 'B', number: 6, text: 'Referência a qualquer evidência/apresentação de relatórios da inspeção.' },
  { id: 'P1_B_7', category: 'Parte I - Item B: Inspeção', code: 'B', number: 7, text: 'Nome, cargo e assinatura da pessoa responsável pela atividade.' },
  
  { id: 'P1_C_1', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 1, text: 'Data e localização da inspeção' },
  { id: 'P1_C_2', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 2, text: 'Registros de autorizações necessárias para realizar a limpeza em água, se aplicável.' },
  { id: 'P1_C_3', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 3, text: 'Descrição das áreas do casco e nicho limpas.' },
  { id: 'P1_C_4', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 4, text: 'Métodos de limpeza reativa utilizados.' },
  { id: 'P1_C_5', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 5, text: 'Estimativa geral de bioincrustação após a limpeza, de acordo com as taxas de incrustação definidas.' },
  { id: 'P1_C_6', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 6, text: 'Referência a qualquer evidência/apresentação de relatórios da atividade.' },
  { id: 'P1_C_7', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 7, text: 'Recibo ou outra evidência documental de coleta/entrega dos resíduos.' },
  { id: 'P1_C_8', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 8, text: 'Nome, cargo e assinatura da pessoa responsável pela atividade.' },
  { id: 'P1_C_9', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 9, text: 'Fabricante e modelo do dispositivo de limpeza e coleta, bem como da empresa de limpeza responsável pela execução.' },
  { id: 'P1_C_10', category: 'Parte I - Item C: Limpeza Reativa', code: 'C', number: 10, text: 'Referência ao padrão de teste para o qual o método foi testado, se relevante.' },
  
  { id: 'P1_D_1', category: 'Parte I - Item D: Procedimentos Adicionais', code: 'D', number: 0, text: 'Procedimentos operacionais adicionais e observações gerais' },
  
  // Parte II
  { id: 'P2_A_1', category: 'Parte II - Item A: Navio fora do perfil', code: 'A', number: 1, text: 'Duração e datas em que o navio não está operando conforme seu BFMP' },
  { id: 'P2_A_2', category: 'Parte II - Item A: Navio fora do perfil', code: 'A', number: 2, text: 'Razão para a partida da operação normal.' },
  { id: 'P2_A_3', category: 'Parte II - Item A: Navio fora do perfil', code: 'A', number: 3, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação (por exemplo, inspeções mais frequentes) durante o período em que o navio está operando fora do perfil operacional esperado.' },
  { id: 'P2_A_4', category: 'Parte II - Item A: Navio fora do perfil', code: 'A', number: 4, text: 'Hora e local (nome do porto ou latitude/longitude) quando o navio volta a operar conforme especificado no BFMP.' },
  
  { id: 'P2_B_1', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 1, text: 'Data/período e descrição de qualquer redução observada na eficácia, dano ou desvio da manutenção/serviço do revestimento anti-incrustante (AFC) durante sua vida útil.' },
  { id: 'P2_B_2', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 2, text: 'Data/período e descrição de qualquer operação além da vida útil esperada.' },
  { id: 'P2_B_3', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 3, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação (por exemplo, inspeções mais frequentes).' },
  { id: 'P2_B_4', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 4, text: 'Data/período e local onde foi realizada qualquer manutenção ou reparo no AFC (por exemplo, em dique seco)' },
  { id: 'P2_B_5', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 5, text: 'Descrição de qualquer AFC, incluindo reparos em remendos, aplicado durante a manutenção. Detalhe o tipo de AFC, a área e os locais em que foi aplicado (incluindo a localização dos blocos de suporte do dique seco, se relevante), uma estimativa percentual de cobertura da reaplicação do AFC, a espessura do revestimento alcançada e qualquer trabalho de preparação de superfície realizado (por exemplo, remoção completa do AFC subjacente ou aplicação de novo AFC sobre o AFC existente).' },
  { id: 'P2_B_6', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 6, text: 'Referência a quaisquer dados de suporte para a manutenção do AFC (por exemplo, arquivo técnico do AFC).' },
  { id: 'P2_B_7', category: 'Parte II - Item B: Manutenção ou dano ao AFC', code: 'B', number: 7, text: 'Nome, cargo e assinatura da pessoa responsável pela atividade.' },

  { id: 'P2_C_1', category: 'Parte II - Item C: Manutenção/serviço ou inatividade/falha do MGPS', code: 'C', number: 1, text: 'Data/período e descrição de qualquer redução observada na eficácia, tempo de inatividade, mau funcionamento ou desvio da manutenção/serviço do sistema de prevenção de crescimento marinho (MGPS) durante sua vida útil.' },
  { id: 'P2_C_2', category: 'Parte II - Item C: Manutenção/serviço ou inatividade/falha do MGPS', code: 'C', number: 2, text: 'Data/período e descrição de operação além da vida útil esperada.' },
  { id: 'P2_C_3', category: 'Parte II - Item C: Manutenção/serviço ou inatividade/falha do MGPS', code: 'C', number: 3, text: 'Data e local de quaisquer instâncias em que o sistema não estava operando conforme o BFMP.' },
  { id: 'P2_C_4', category: 'Parte II - Item C: Manutenção/serviço ou inatividade/falha do MGPS', code: 'C', number: 4, text: 'Registros de manutenção (incluindo monitoramento regular das funções elétricas e mecânicas dos sistemas, calibração ou ajuste das dosagens de tratamento).' },
  { id: 'P2_C_5', category: 'Parte II - Item C: Manutenção/serviço ou inatividade/falha do MGPS', code: 'C', number: 5, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação (por exemplo, inspeções mais frequentes).' },
  { id: 'P2_C_6', category: 'Parte II - Item C: Manutenção/serviço ou inatividade/falha do MGPS', code: 'C', number: 6, text: 'Nome, cargo e assinatura da pessoa responsável pela atividade.' },

  { id: 'P2_D_1', category: 'Parte II - Item D: Manutenção/serviço ou inatividade/falha de outros AFS', code: 'D', number: 1, text: 'Data/período e descrição de qualquer redução observada na eficácia, tempo de inatividade, mau funcionamento ou desvio da manutenção/serviço de outros Sistemas de Proteção Antifouling (AFS) durante sua vida útil' },
  { id: 'P2_D_2', category: 'Parte II - Item D: Manutenção/serviço ou inatividade/falha de outros AFS', code: 'D', number: 2, text: 'Data/período e descrição de operação além da vida útil esperada.' },
  { id: 'P2_D_3', category: 'Parte II - Item D: Manutenção/serviço ou inatividade/falha de outros AFS', code: 'D', number: 3, text: 'Data e local de quaisquer instâncias em que o sistema não estava operando conforme o Plano de Gerenciamento de Bioincrustação.' },
  { id: 'P2_D_4', category: 'Parte II - Item D: Manutenção/serviço ou inatividade/falha de outros AFS', code: 'D', number: 4, text: 'Registros de manutenção.' },
  { id: 'P2_D_5', category: 'Parte II - Item D: Manutenção/serviço ou inatividade/falha de outros AFS', code: 'D', number: 5, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação (por exemplo, inspeções mais frequentes).' },

  { id: 'P2_E_1', category: 'Parte II - Item E: Desvio do uso regular da limpeza proativa', code: 'E', number: 1, text: 'Data e local onde o navio não realizou a limpeza proativa conforme especificado.' },
  { id: 'P2_E_2', category: 'Parte II - Item E: Desvio do uso regular da limpeza proativa', code: 'E', number: 2, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação (por exemplo, inspeções de bioincrustação e/ou limpeza reativa antes do retorno à atividade de limpeza proativa).' },
  { id: 'P2_E_3', category: 'Parte II - Item E: Desvio do uso regular da limpeza proativa', code: 'E', number: 3, text: 'Registros de manutenção, se houver.' },
  { id: 'P2_E_4', category: 'Parte II - Item E: Desvio do uso regular da limpeza proativa', code: 'E', number: 4, text: 'Data em que o navio retornou às atividades normais com a limpeza proativa.' },

  { id: 'P2_F_1', category: 'Parte II - Item F: Desvio da limpeza reativa necessária', code: 'F', number: 1, text: 'Data e local onde o navio foi inspecionado e a limpeza reativa se mostrou necessária' },
  { id: 'P2_F_2', category: 'Parte II - Item F: Desvio da limpeza reativa necessária', code: 'F', number: 2, text: 'Ações de contingência tomadas até a limpeza reativa, incluindo o agendamento da atividade de limpeza reativa.' },
  { id: 'P2_F_3', category: 'Parte II - Item F: Desvio da limpeza reativa necessária', code: 'F', number: 3, text: 'Data em que o navio concluiu a limpeza reativa e referência ao registro relevante na Parte I.' },

  { id: 'P2_G_1', category: 'Parte II - Item G: Navio parado por período longo', code: 'G', number: 1, text: 'Data e local onde o navio ficou parado, incluindo uma descrição geral da pressão de bioincrustação, por exemplo, temperatura e distância da linha costeira.' },
  { id: 'P2_G_2', category: 'Parte II - Item G: Navio parado por período longo', code: 'G', number: 2, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação (por exemplo, inspeções, fechamento de caixas de mar ou viagens curtas antes e após o período de parada).' },
  { id: 'P2_G_3', category: 'Parte II - Item G: Navio parado por período longo', code: 'G', number: 3, text: 'Precauções tomadas para minimizar a acumulação de bioincrustação (por exemplo, viagem curta).' },
  { id: 'P2_G_4', category: 'Parte II - Item G: Navio parado por período longo', code: 'G', number: 4, text: 'Data em que o navio retornou às operações normais.' },

  { id: 'P2_H_1', category: 'Parte II - Item H: Perda de desempenho', code: 'H', number: 1, text: 'Data e local onde o navio começou a apresentar perda de desempenho além das expectativas.' },
  { id: 'P2_H_2', category: 'Parte II - Item H: Perda de desempenho', code: 'H', number: 2, text: 'Inspeções ou ações de gestão de bioincrustação realizadas antes e após o período de perda de desempenho.' },
  { id: 'P2_H_3', category: 'Parte II - Item H: Perda de desempenho', code: 'H', number: 3, text: 'Ações de contingência tomadas para minimizar a acumulação de bioincrustação.' },
  { id: 'P2_H_4', category: 'Parte II - Item H: Perda de desempenho', code: 'H', number: 4, text: 'Data em que o navio retornou ao desempenho normal.' },

  { id: 'P2_I_1', category: 'Parte II - Item I: Outras variações', code: 'I', number: 0, text: 'Outras variações' },
];