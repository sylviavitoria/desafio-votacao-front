import { Associado, AssociadoResponse } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';
import useFormEntidade from './useFormEntidade';

interface UseFormAssociadoProps {
  associadoId?: number;
  associadoInicial?: Associado;
  onSuccess?: (data: AssociadoResponse | Associado) => void;
}

export default function useFormAssociado({
  associadoId,
  associadoInicial,
  onSuccess
}: UseFormAssociadoProps = {}) {
  const initialValues: Associado = {
    nome: '',
    cpf: '',
    email: '',
    id: associadoId
  };

  const validationRules = {
    nome: [
      { required: true, message: 'Nome é obrigatório' }
    ],
    cpf: [
      { required: true, message: 'CPF é obrigatório' },
      {
        pattern: /^\d{11}$/,
        message: 'CPF deve conter 11 dígitos numéricos (sem pontuação)'
      }
    ],
    email: [
      { required: true, message: 'Email é obrigatório' },
      { pattern: /\S+@\S+\.\S+/, message: 'Formato de email inválido' }
    ]
  };

  return useFormEntidade<Associado, AssociadoResponse>({
    entidadeId: associadoId,
    entidadeInicial: associadoInicial,
    initialValues,
    validationRules,
    service: associadoService,
    onSuccess
  });
}