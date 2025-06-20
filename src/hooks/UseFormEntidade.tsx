import { useEffect } from 'react';
import useForm from './useForm';

type FieldValue = string | number | boolean | null;
type FormData = Record<string, FieldValue>;

interface ValidationRule {
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  custom?: (value: FieldValue, formData?: FormData) => boolean;
  message: string;
}

interface UseFormEntidadeProps<T extends FormData, R, U = Partial<T>> {
  entidadeId?: number;
  entidadeInicial?: T;
  initialValues: T;
  validationRules: Record<string, ValidationRule[]>;
  service: {
    criar: (data: T) => Promise<R>;
    atualizar: (id: number, data: U) => Promise<R>;
  };
  onSuccess?: (data: R) => void;
  prepararParaAtualizar?: (data: T) => U;
}

export default function useFormEntidade<T extends FormData, R, U = Partial<T>>({
  entidadeId,
  entidadeInicial,
  initialValues,
  validationRules,
  service,
  onSuccess,
  prepararParaAtualizar = ((data) => data as unknown as U)
}: UseFormEntidadeProps<T, R, U>) {
  const form = useForm<T>({
    initialValues: entidadeInicial || initialValues,
    validationRules,
    onSubmit: async (data) => {
      try {
        let response: R;

        if (entidadeId || data.id) {
          const id = entidadeId || (data.id as number);
          const dataParaAtualizar = prepararParaAtualizar(data);
          response = await service.atualizar(id, dataParaAtualizar);
        } else {
          response = await service.criar(data);
        }

        if (onSuccess) {
          onSuccess(response);
        }

        return response;
      } catch (error) {
        console.error('Erro na operação:', error instanceof Error ? error.message : 'Erro desconhecido');
        throw error;
      }
    }
  });

  const formDataId = form.formData.id;

  useEffect(() => {
    if (entidadeInicial) {
      form.setFormData(entidadeInicial);
    } else if (entidadeId && !formDataId) {
      form.setFormData(prevData => ({ ...prevData, id: entidadeId }));
    }
  }, [entidadeInicial, entidadeId, form, formDataId]);

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