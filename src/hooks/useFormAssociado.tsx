import useForm from './useForm';
import { Associado } from '../types/Associado';
import { associadoService } from '../service/AssociadoService';

export default function useFormAssociado() {
  return useForm<Associado>({
    initialValues: {
      nome: '',
      cpf: '',
      email: ''
    },
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
        const response = await associadoService.criar(data);
        console.log('Associado criado com sucesso:', response);
        return response;
      } catch (error) {
        console.error('Erro ao criar associado:', error);
        throw new Error(
          error.message || 'Ocorreu um erro ao cadastrar o associado. Tente novamente mais tarde.'
        );
      }
    }
  });
}