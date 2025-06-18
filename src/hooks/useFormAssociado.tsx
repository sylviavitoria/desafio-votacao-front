import { useEffect } from 'react';
import useForm from './useForm';
import { Associado, AssociadoResponse } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';

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
  const initialValues: Associado = associadoInicial || {
    nome: '',
    cpf: '',
    email: '',
    id: associadoId
  };

  const form = useForm<Associado>({
    initialValues,
    validationRules: {
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
    },
    onSubmit: async (data) => {
      try {
        let response;

        if (data.id) {
          response = await associadoService.atualizar(data.id, data);
          console.log('Associado atualizado com sucesso:', response);
        } else {
          response = await associadoService.criar(data);
          console.log('Associado criado com sucesso:', response);
        }

        if (onSuccess) {
          onSuccess(response);
        }

        return response;
      } catch (error) {
        console.error('Erro na operação do associado:', error);
        throw error;
      }
    }
  });

  useEffect(() => {
    if (associadoInicial) {
      form.setFormData(associadoInicial);
    } else if (associadoId && !form.formData.id) {
      form.setFormData({ ...form.formData, id: associadoId });
    }
  }, [associadoInicial, associadoId, form]);

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