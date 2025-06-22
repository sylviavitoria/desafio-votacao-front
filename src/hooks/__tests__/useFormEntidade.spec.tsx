import { renderHook, act } from '@testing-library/react';
import useFormEntidade from '../useFormEntidade';

jest.mock('../useForm', () => {
  return {
    __esModule: true,
    default: jest.fn(({ initialValues, onSubmit }) => {
      return {
        formData: { ...initialValues },
        errors: {},
        enviando: false,
        enviado: false,
        handleChange: jest.fn(),
        handleSubmit: jest.fn(async (e) => {
          e.preventDefault();
          if (onSubmit) await onSubmit(initialValues);
        }),
        resetForm: jest.fn(),
        setFormData: jest.fn()
      };
    })
  };
});

describe('useFormEntidade', () => {
  const initialValues = {
    nome: '',
    descricao: '',
    id: undefined
  };
  
  const mockResponse = {
    id: 1,
    nome: 'Entidade Teste',
    descricao: 'Descrição teste'
  };
  
  const mockService = {
    criar: jest.fn().mockResolvedValue(mockResponse),
    atualizar: jest.fn().mockResolvedValue(mockResponse)
  };
  
  const mockValidationRules = {
    nome: [{ required: true, message: 'Nome é obrigatório' }]
  };
  
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve inicializar com os valores padrão corretamente', () => {
    const { result } = renderHook(() => useFormEntidade({
      initialValues,
      validationRules: mockValidationRules,
      service: mockService
    }));

    expect(result.current.formData).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.enviando).toBe(false);
    expect(result.current.enviado).toBe(false);
  });

  it('deve chamar service.atualizar quando há entidadeId', async () => {
    const useFormModule = await import('../useForm');
    const useFormMock = useFormModule.default;
    jest.mocked(useFormMock).mockImplementation(({ initialValues }) => ({
      formData: { ...initialValues },
      errors: {},
      enviando: false,
      enviado: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      resetForm: jest.fn(),
      setFormData: jest.fn()
    }));

    const entidadeId = 42;

    renderHook(() => useFormEntidade({
      entidadeId,
      initialValues,
      validationRules: mockValidationRules,
      service: mockService,
      onSuccess: mockOnSuccess
    }));

    const passedOnSubmit = jest.mocked(useFormMock).mock.calls[0][0].onSubmit;
    
    await act(async () => {
      await passedOnSubmit({ 
        ...initialValues, 
        nome: 'Nome Atualizado',
        id: entidadeId 
      });
    });

    expect(mockService.atualizar).toHaveBeenCalledWith(
      entidadeId, 
      expect.objectContaining({
        nome: 'Nome Atualizado',
        id: entidadeId
      })
    );
    expect(mockService.criar).not.toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
  });

  it('deve usar prepararParaAtualizar para formatar dados antes de atualizar', async () => {

    const useFormModule = await import('../useForm');
    const useFormMock = useFormModule.default;
    jest.mocked(useFormMock).mockImplementation(({ initialValues }) => ({
      formData: { ...initialValues },
      errors: {},
      enviando: false,
      enviado: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      resetForm: jest.fn(),
      setFormData: jest.fn()
    }));

    const mockPrepararParaAtualizar = jest.fn().mockImplementation(data => ({
      nome: data.nome.toUpperCase() 
    }));

    renderHook(() => useFormEntidade({
      entidadeId: 1,
      initialValues,
      validationRules: mockValidationRules,
      service: mockService,
      prepararParaAtualizar: mockPrepararParaAtualizar
    }));

    const passedOnSubmit = jest.mocked(useFormMock).mock.calls[0][0].onSubmit;
    
    await act(async () => {
      await passedOnSubmit({ ...initialValues, nome: 'nome teste', id: 1 });
    });

    expect(mockPrepararParaAtualizar).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'nome teste', id: 1 })
    );
    
    expect(mockService.atualizar).toHaveBeenCalledWith(
      1, 
      expect.objectContaining({ nome: 'NOME TESTE' })
    );
  });

  it('deve atualizar formData quando entidadeInicial é fornecido', () => {
    const setFormDataMock = jest.fn();
    
    const useFormModule = jest.requireMock('../useForm');
    const useFormMock = useFormModule.default;
    jest.mocked(useFormMock).mockImplementation(() => ({
      formData: { ...initialValues },
      errors: {},
      enviando: false,
      enviado: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      resetForm: jest.fn(),
      setFormData: setFormDataMock
    }));

    const entidadeInicial = {
      nome: 'Nome Inicial',
      descricao: 'Descrição Inicial',
      id: 5
    };

    renderHook(() => useFormEntidade({
      initialValues,
      validationRules: mockValidationRules,
      service: mockService,
      entidadeInicial
    }));

    expect(setFormDataMock).toHaveBeenCalledWith(entidadeInicial);
  });

  it('deve definir ID no formData quando entidadeId é fornecido', () => {
    const setFormDataMock = jest.fn();
    
    const useFormModule = jest.requireMock('../useForm');
    const useFormMock = useFormModule.default;
    jest.mocked(useFormMock).mockImplementation(() => ({
      formData: { ...initialValues, id: undefined },
      errors: {},
      enviando: false,
      enviado: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      resetForm: jest.fn(),
      setFormData: setFormDataMock
    }));

    const entidadeId = 99;

    renderHook(() => useFormEntidade({
      entidadeId,
      initialValues,
      validationRules: mockValidationRules,
      service: mockService
    }));

    expect(setFormDataMock).toHaveBeenCalled();
    
    const setFormDataCallback = setFormDataMock.mock.calls[0][0];
    const resultData = setFormDataCallback({ ...initialValues });
    expect(resultData).toEqual(expect.objectContaining({ id: entidadeId }));
  });

  it('deve tratar erros durante a submissão do formulário', async () => {
    const mockError = new Error('Erro ao processar');
    
    const useFormModule = await import('../useForm');
    const useFormMock = useFormModule.default;
    jest.mocked(useFormMock).mockImplementation(({ initialValues }) => ({
      formData: { ...initialValues },
      errors: {},
      enviando: false,
      enviado: false,
      handleChange: jest.fn(),
      handleSubmit: jest.fn(),
      resetForm: jest.fn(),
      setFormData: jest.fn()
    }));

    mockService.criar.mockRejectedValueOnce(mockError);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    renderHook(() => useFormEntidade({
      initialValues,
      validationRules: mockValidationRules,
      service: mockService
    }));

    const passedOnSubmit = jest.mocked(useFormMock).mock.calls[0][0].onSubmit;
    
    let caughtError;
    await act(async () => {
      try {
        await passedOnSubmit({ ...initialValues, nome: 'Teste Erro' });
      } catch (error) {
        caughtError = error;
      }
    });

    expect(caughtError).toBe(mockError);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro na operação:', 'Erro ao processar');
    expect(mockOnSuccess).not.toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('deve retornar as funções e valores esperados', () => {
    const mockHandleChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const mockResetForm = jest.fn();
    const mockSetFormData = jest.fn();

    const useFormModule = jest.requireMock('../useForm');
    const useFormMock = useFormModule.default;
    jest.mocked(useFormMock).mockImplementation(() => ({
      formData: { ...initialValues },
      errors: { teste: 'erro teste' },
      enviando: true,
      enviado: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      resetForm: mockResetForm,
      setFormData: mockSetFormData
    }));

    const { result } = renderHook(() => useFormEntidade({
      initialValues,
      validationRules: mockValidationRules,
      service: mockService
    }));

    expect(result.current).toEqual({
      formData: initialValues,
      errors: { teste: 'erro teste' },
      enviando: true,
      enviado: true,
      handleChange: mockHandleChange,
      handleSubmit: mockHandleSubmit,
      resetForm: mockResetForm,
      setFormData: mockSetFormData
    });
  });
});