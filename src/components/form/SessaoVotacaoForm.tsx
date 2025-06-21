import { FormEvent } from 'react';
import GenericForm from './GenericForm';

interface FormErrors {
    pautaId?: string;
    duracaoMinutos?: string;
    dataInicio?: string;
    dataFim?: string;
    form?: string;
}

interface SessaoVotacaoFormProps {
    formData: {
        pautaId: number;
        duracaoMinutos?: number;
        dataInicio?: string;
        dataFim?: string;
    };
    errors: FormErrors;
    enviando: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    submitLabel?: { idle: string; enviando: string };
    modo: 'imediato' | 'agendado';
    setModo: (modo: 'imediato' | 'agendado') => void;
}

const SessaoVotacaoForm = ({
    formData,
    errors,
    enviando,
    onChange,
    onSubmit,
    submitLabel = { idle: 'Iniciar Sessão', enviando: 'Iniciando...' },
    modo,
    setModo
}: SessaoVotacaoFormProps) => {

    const camposPautaId = [
        {
            name: 'pautaId',
            label: 'ID da Pauta',
            type: 'text' as const
        }
    ];

    const camposImediato = [
        {
            name: 'duracaoMinutos',
            label: 'Duração (minutos)',
            type: 'text' as const,
            help: 'Tempo de duração da sessão em minutos. Se não informado, será usado 1 minuto.'
        }
    ];

    const camposAgendado = [
        {
            name: 'dataInicio',
            label: 'Data e Hora de Início',
            type: 'text' as const,
            help: 'Formato: YYYY-MM-DDThh:mm:ss (ex: 2025-05-25T22:00:00)'
        },
        {
            name: 'dataFim',
            label: 'Data e Hora de Fim',
            type: 'text' as const,
            help: 'Formato: YYYY-MM-DDThh:mm:ss (ex: 2025-05-26T11:00:00)'
        }
    ];

    const modoFields = modo === 'imediato' ? camposImediato : camposAgendado;
    const campos = [...camposPautaId, ...modoFields];

    return (
        <>
            <div className="modo-container" style={{ marginBottom: '20px' }}>
                <div className="modo-toggle" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                        type="button"
                        className={`botao-secundario ${modo === 'imediato' ? 'active' : ''}`}
                        style={{
                            backgroundColor: modo === 'imediato' ? 'var(--primary)' : '',
                            color: modo === 'imediato' ? 'white' : '',
                        }}
                        onClick={() => setModo('imediato')}
                    >
                        Abertura Imediata
                    </button>
                    <button
                        type="button"
                        className={`botao-secundario ${modo === 'agendado' ? 'active' : ''}`}
                        style={{
                            backgroundColor: modo === 'agendado' ? 'var(--primary)' : '',
                            color: modo === 'agendado' ? 'white' : '',
                        }}
                        onClick={() => setModo('agendado')}
                    >
                        Agendamento
                    </button>
                </div>
            </div>

            <GenericForm
                formData={formData}
                errors={errors}
                enviando={enviando}
                campos={campos}
                submitLabel={submitLabel}
                onChange={onChange}
                onSubmit={onSubmit}
            />
        </>
    );
};

export default SessaoVotacaoForm;