import { renderHook, act } from '@testing-library/react';
import useForm from '../useForm';

describe('useForm', () => {
  const initialValues = {
    nome: '',
    email: '',
    idade: 0
  };

  const validationRules = {
    nome: [
      { required: true, message: 'Nome é obrigatório' }
    ],
    email: [
      { required: true, message: 'Email é obrigatório' },
      { pattern: /\S+@\S+\.\S+/, message: 'Email inválido' }
    ],
    idade: [
      { required: true, message: 'Idade é obrigatória' },
      { 
        custom: (value) => Number(value) >= 18, 
        message: 'Idade deve ser maior ou igual a 18' 
      }
    ]
  };

  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve inicializar com os valores padrão corretamente', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validationRules
    }));

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.enviando).toBe(false);
    expect(result.current.enviado).toBe(false);
  });

  it('deve atualizar formData quando handleChange é chamado', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validationRules
    }));

    act(() => {
      result.current.handleChange({
        target: {
          name: 'nome',
          value: 'João Silva'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.nome).toBe('João Silva');
  });

  it('deve limpar erro específico de campo quando o campo é alterado', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validationRules
    }));

    act(() => {
      result.current.setFormData({ ...initialValues });
      const errors = { ...result.current.errors, nome: 'Nome é obrigatório' };

      Object.defineProperty(result.current, 'errors', {
        value: errors
      });
    });

    act(() => {
      result.current.handleChange({
        target: {
          name: 'nome',
          value: 'João Silva'
        }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.errors.nome).toBeUndefined();
  });

  it('deve processar corretamente o tipo de campo checkbox', () => {
    const { result } = renderHook(() => useForm({
      initialValues: { ...initialValues, aceito: false },
      validationRules
    }));

    act(() => {
      result.current.handleChange({
        target: {
          name: 'aceito',
          type: 'checkbox',
          checked: true
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.aceito).toBe(true);
  });

  it('deve validar campos obrigatórios corretamente', async () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validationRules,
      onSubmit: mockOnSubmit
    }));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.nome).toBe('Nome é obrigatório');
    expect(result.current.errors.email).toBe('Email é obrigatório');

    expect(result.current.errors.idade).toBe('Idade deve ser maior ou igual a 18');

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve validar padrões regex corretamente', async () => {
    const { result } = renderHook(() => useForm({
      initialValues: { ...initialValues, nome: 'João', email: 'email-invalido' },
      validationRules,
      onSubmit: mockOnSubmit
    }));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.email).toBe('Email inválido');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve validar regras customizadas corretamente', async () => {
    const { result } = renderHook(() => useForm({
      initialValues: { ...initialValues, nome: 'João', email: 'joao@exemplo.com', idade: 16 },
      validationRules,
      onSubmit: mockOnSubmit
    }));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.idade).toBe('Idade deve ser maior ou igual a 18');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve chamar onSubmit quando todos os dados são válidos', async () => {
    const validData = { nome: 'João', email: 'joao@exemplo.com', idade: 25 };
    const { result } = renderHook(() => useForm({
      initialValues: validData,
      validationRules,
      onSubmit: mockOnSubmit
    }));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.enviado).toBe(true);
    expect(mockOnSubmit).toHaveBeenCalledWith(validData);
  });

  it('deve resetar o formulário após submissão bem-sucedida', async () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useForm({
      initialValues,
      validationRules,
      onSubmit: mockOnSubmit,
      resetAfterSubmit: true,
      successTimeout: 100
    }));

    act(() => {
      result.current.setFormData({
        nome: 'João',
        email: 'joao@exemplo.com',
        idade: 25
      });
    });

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.enviado).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.enviado).toBe(false);
    expect(result.current.formData).toEqual(initialValues);
    
    jest.useRealTimers();
  });

  it('deve definir erro de formulário quando onSubmit lança uma exceção', async () => {
    const mockErrorSubmit = jest.fn().mockImplementation(() => {
      throw new Error('Erro no servidor');
    });

    const { result } = renderHook(() => useForm({
      initialValues: { nome: 'João', email: 'joao@exemplo.com', idade: 25 },
      validationRules,
      onSubmit: mockErrorSubmit
    }));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn()
      } as unknown as React.FormEvent<HTMLFormElement>);
    });

    expect(result.current.errors.form).toBe('Erro no servidor');
    expect(result.current.enviando).toBe(false);
  });

  it('deve resetar o formulário quando resetForm é chamado', () => {
    const { result } = renderHook(() => useForm({
      initialValues,
      validationRules
    }));
    act(() => {
      result.current.setFormData({
        nome: 'João',
        email: 'email-invalido',
        idade: 16
      });
      Object.defineProperty(result.current, 'errors', {
        value: { email: 'Email inválido', idade: 'Idade deve ser maior ou igual a 18' }
      });
      Object.defineProperty(result.current, 'enviado', {
        value: true
      });
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.enviado).toBe(false);
  });
});