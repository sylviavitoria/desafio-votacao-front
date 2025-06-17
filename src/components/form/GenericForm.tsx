import type { FormEvent, ChangeEvent } from 'react';

type FormValue = string | number | boolean | null;

interface GenericFormProps {
    formData: Record<string, FormValue>;
    errors: Record<string, string | undefined>;
    enviando: boolean;
    campos: {
        name: string;
        label: string;
        type: 'text' | 'textarea' | 'select';
        options?: Array<{ value: string | number, label: string }>;
        help?: string;
        rows?: number;
    }[];
    submitLabel: { idle: string; enviando: string };
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const GenericForm = ({ formData, errors, enviando, campos, submitLabel, onChange, onSubmit }: GenericFormProps) => {
    return (
        <form onSubmit={onSubmit}>
            {campos.map((campo) => (
                <div className="form-group" key={campo.name}>
                    <label htmlFor={campo.name}>
                        {campo.label}: <span className="required">*</span>
                    </label>

                    {campo.type === 'textarea' ? (
                        <textarea
                            id={campo.name}
                            name={campo.name}
                            value={String(formData[campo.name] || '')}
                            onChange={onChange}
                            rows={campo.rows || 5}
                            className={errors[campo.name] ? "input-error" : ""}
                            disabled={enviando}
                        />
                    ) : campo.type === 'select' ? (
                        <select
                            id={campo.name}
                            name={campo.name}
                            value={String(formData[campo.name] || '')}
                            onChange={onChange}
                            className={errors[campo.name] ? "input-error" : ""}
                            disabled={enviando}
                        >
                            <option value="">Selecione</option>
                            {campo.options?.map(option => (
                                <option key={String(option.value)} value={String(option.value)}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={campo.type}
                            id={campo.name}
                            name={campo.name}
                            value={formData[campo.name] || ''}
                            onChange={onChange}
                            className={errors[campo.name] ? "input-error" : ""}
                            disabled={enviando}
                        />
                    )}

                    {errors[campo.name] && (
                        <div className="error-text">{errors[campo.name]}</div>
                    )}

                    {campo.help && (
                        <div className="form-help">{campo.help}</div>
                    )}
                </div>
            ))}

            <button
                type="submit"
                disabled={enviando}
            >
                {enviando ? submitLabel.enviando : submitLabel.idle}
            </button>
        </form>
    );
};

export default GenericForm;