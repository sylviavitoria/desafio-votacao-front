import { useEffect } from 'react';
import useForm from './useForm';
import { Pauta, PautaResponse, PautaAtualizarRequest } from '../types/Pauta';
import { pautaService } from '../service/PautaService';

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
  const initialValues: Pauta = pautaInicial || {
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
    ]
  };

  if (!pautaId) {
    validationRules['criadorId'] = [
      { required: true, message: 'ID do criador é obrigatório' }
    ];
  }

  const form = useForm<Pauta>({
    initialValues,
    validationRules,
    onSubmit: async (data) => {
      try {
        let response;

        if (data.id) {
          const pautaAtualizar: PautaAtualizarRequest = {
            titulo: data.titulo,
            descricao: data.descricao
          };
          response = await pautaService.atualizar(data.id, pautaAtualizar);
          console.log('Pauta atualizada com sucesso:', response);
        } else {
          response = await pautaService.criar(data);
          console.log('Pauta criada com sucesso:', response);
        }

        if (onSuccess) {
          onSuccess(response);
        }

        return response;
      } catch (error) {
        console.error('Erro na operação da pauta:', error);
        throw error;
      }
    }
  });

  useEffect(() => {
    if (pautaInicial) {
      form.setFormData(pautaInicial);
    } else if (pautaId && !form.formData.id) {
      form.setFormData({ ...form.formData, id: pautaId });
    }
  }, [pautaInicial, pautaId, form]);

  return {
    formData: form.formData,
    errors: form.errors,
    enviando: form.enviando,
    enviado: form.enviado,
    handleChange: form.handleChange,
    handleSubmit: form.handleSubmit,
    resetForm: form.resetForm,
    setFormData: form.setFormData
  };
}