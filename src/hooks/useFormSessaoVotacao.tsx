import { SessaoVotacaoRequest, SessaoVotacaoResponse } from '../types/SessaoVotacao';
import { sessaoVotacaoService } from '../service/SessaoVotacaoService';
import useFormEntidade from './useFormEntidade';
import { useState } from 'react';

interface UseFormSessaoVotacaoProps {
    pautaId?: number;
    onSuccess?: (data: SessaoVotacaoResponse) => void;
}

export default function useFormSessaoVotacao({
    pautaId,
    onSuccess
}: UseFormSessaoVotacaoProps = {}) {
    const [modo, setModo] = useState<'imediato' | 'agendado'>('imediato');

    const initialValues: SessaoVotacaoRequest = {
        pautaId: pautaId || 0,
        duracaoMinutos: '',
        dataInicio: '',
        dataFim: ''
    };

    const validationRules = {
        pautaId: [
            { required: true, message: 'ID da pauta é obrigatório' }
        ],
        ...(modo === 'imediato' ? {

        } : {
            dataInicio: [
                { required: true, message: 'Data de início é obrigatória' }
            ],
            dataFim: [
                { required: true, message: 'Data de fim é obrigatória' },
                {
                    custom: (value, formData) => {
                        if (!value || !formData?.dataInicio) return true;
                        return new Date(value as string) > new Date(formData.dataInicio as string);
                    },
                    message: 'Data de fim deve ser posterior à data de início'
                }
            ]
        })
    };

    const prepararParaEnvio = (data: SessaoVotacaoRequest): SessaoVotacaoRequest => {
        if (modo === 'imediato') {
            return {
                pautaId: data.pautaId,
                duracaoMinutos: data.duracaoMinutos
            };
        } else {
            return {
                pautaId: data.pautaId,
                dataInicio: data.dataInicio,
                dataFim: data.dataFim
            };
        }
    };

    const form = useFormEntidade<SessaoVotacaoRequest, SessaoVotacaoResponse>({
        initialValues,
        validationRules,
        service: {
            criar: (data) => sessaoVotacaoService.criar(prepararParaEnvio(data)),
            atualizar: async () => { throw new Error('Não implementado'); } 
        },
        onSuccess
    });

    return {
        ...form,
        modo,
        setModo
    };
}