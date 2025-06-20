import { Pauta, PautaResponse, PautaAtualizarRequest } from '../types/Pauta';
import { pautaService } from '../service/PautaService';
import useFormEntidade from './useFormEntidade';

interface UseFormPautaProps {
  pautaId?: number;
  pautaInicial?: Pauta;
  onSuccess?: (data: PautaResponse | Pauta) => void;
}

export default function useFormPauta({
  pautaId,
  pautaInicial,
  onSuccess
}: UseFormPautaProps = {}) {
  const initialValues: Pauta = {
    titulo: '',
    descricao: '',
    criadorId: '',
    id: pautaId
  };

  const validationRules = {
    titulo: [
      { required: true, message: 'Título é obrigatório' }
    ],
    descricao: [
      { required: true, message: 'Descrição é obrigatória' }
    ],
    ...(pautaId ? {} : {
      criadorId: [
        { required: true, message: 'ID do criador é obrigatório' }
      ]
    })
  };

  const prepararParaAtualizar = (data: Pauta): PautaAtualizarRequest => ({
    titulo: data.titulo,
    descricao: data.descricao
  });

  return useFormEntidade<Pauta, PautaResponse>({
    entidadeId: pautaId,
    entidadeInicial: pautaInicial,
    initialValues,
    validationRules,
    service: pautaService,
    onSuccess,
    prepararParaAtualizar
  });
}