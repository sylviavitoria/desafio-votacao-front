import { useState } from 'react';
import useForm from './useForm';
import { SessaoVotacaoAtualizarRequest, SessaoVotacaoResponse } from '../types/SessaoVotacao';
import useAtualizarPeriodoSessao from './useAtualizarPeriodoSessao';

interface UseFormAtualizarPeriodoSessaoProps {
    sessaoId: number;
    onSuccess?: (data: SessaoVotacaoResponse) => void;
}

export default function useFormAtualizarPeriodoSessao({
    sessaoId,
    onSuccess
}: UseFormAtualizarPeriodoSessaoProps) {
    const [modo, setModo] = useState<'minutos' | 'data'>('minutos');

    const initialValues: SessaoVotacaoAtualizarRequest = {
        minutosAdicionais: '',
        dataFim: ''
    };

    const validationRules = {
        ...(modo === 'minutos' ? {
            minutosAdicionais: [
                { required: true, message: 'Número de minutos é obrigatório' },
                {
                    custom: (value) => {
                        const num = Number(value);
                        return !isNaN(num) && num > 0;
                    },
                    message: 'Deve ser um número maior que zero'
                }
            ]
        } : {
            dataFim: [
                { required: true, message: 'Data de fim é obrigatória' },
                {
                    custom: (value) => {
                        if (!value) return false;
                        try {
                            const data = new Date(value as string);
                            return data > new Date();
                        } catch {
                            return false;
                        }
                    },
                    message: 'Data deve ser futura e em formato válido (YYYY-MM-DDThh:mm:ss)'
                }
            ]
        })
    };

    const {
        atualizarPeriodo,
        atualizando,
        erro,
        enviado
    } = useAtualizarPeriodoSessao({
        onSuccess
    });

    const form = useForm<SessaoVotacaoAtualizarRequest>({
        initialValues,
        validationRules,
        onSubmit: async (data) => {
            const dadosParaEnviar: SessaoVotacaoAtualizarRequest = {};

            if (modo === 'minutos') {
                dadosParaEnviar.minutosAdicionais = Number(data.minutosAdicionais);
            } else {
                dadosParaEnviar.dataFim = data.dataFim as string;
            }

            await atualizarPeriodo(sessaoId, dadosParaEnviar);
        }
    });

    return {
        ...form,
        atualizando,
        enviado,
        erro,
        modo,
        setModo
    };
}