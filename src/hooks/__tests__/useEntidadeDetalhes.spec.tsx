import { renderHook, act } from '@testing-library/react';
import useEntidadeDetalhes from '../useEntidadeDetalhes';

interface MockEntity {
  id: number;
  nome: string;
}

describe('useEntidadeDetalhes', () => {
  const mockEntity: MockEntity = { id: 1, nome: 'Entidade Teste' };

  const mockService = {
    obterPorId: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockService.obterPorId.mockResolvedValue(mockEntity);
  });

  it('deve iniciar com valores padrão corretos', () => {
    const { result } = renderHook(() => useEntidadeDetalhes<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    expect(result.current.entidade).toBeNull();
    expect(result.current.carregando).toBe(false);
    expect(result.current.erro).toBeNull();
    expect(typeof result.current.carregarEntidade).toBe('function');
  });

  it('deve carregar entidade automaticamente quando id é fornecido e carregarAutomaticamente=true', async () => {
    await act(async () => {
      renderHook(() => useEntidadeDetalhes<MockEntity>({
        id: 1,
        service: mockService
      }));
    });

    expect(mockService.obterPorId).toHaveBeenCalledWith(1);
  });

  it('não deve carregar entidade automaticamente quando carregarAutomaticamente=false', () => {
    renderHook(() => useEntidadeDetalhes<MockEntity>({
      id: 1,
      service: mockService,
      carregarAutomaticamente: false
    }));

    expect(mockService.obterPorId).not.toHaveBeenCalled();
  });

  it('não deve carregar entidade automaticamente quando id não é fornecido', () => {
    renderHook(() => useEntidadeDetalhes<MockEntity>({
      service: mockService
    }));

    expect(mockService.obterPorId).not.toHaveBeenCalled();
  });

  it('deve atualizar o estado com a entidade carregada', async () => {
    const { result } = renderHook(() => useEntidadeDetalhes<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    await act(async () => {
      await result.current.carregarEntidade(1);
    });

    expect(result.current.entidade).toEqual(mockEntity);
    expect(result.current.carregando).toBe(false);
    expect(result.current.erro).toBeNull();
  });

  it('deve definir carregando=true durante o carregamento', async () => {
    let resolvePromise: (value: MockEntity) => void;
    mockService.obterPorId.mockReturnValue(
      new Promise(resolve => {
        resolvePromise = resolve;
      })
    );

    const { result } = renderHook(() => useEntidadeDetalhes<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    const carregandoAntes = result.current.carregando;
    let promiseCarregamento: Promise<void>;

    act(() => {
      promiseCarregamento = result.current.carregarEntidade(1);
    });

    expect(carregandoAntes).toBe(false);
    expect(result.current.carregando).toBe(true);

    await act(async () => {
      resolvePromise!(mockEntity);
      await promiseCarregamento;
    });

    expect(result.current.carregando).toBe(false);
  });

  it('deve retornar erro ao tentar carregar entidade com ID inválido', async () => {
    const { result } = renderHook(() => useEntidadeDetalhes<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    await act(async () => {
      await result.current.carregarEntidade(undefined).catch(() => { });
    });

    expect(result.current.erro).toBe('ID não informado');
    expect(result.current.entidade).toBeNull();
  });

  it('deve registrar erro no console quando falha ao carregar entidade', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const errorObj = new Error('Erro ao carregar entidade');
    mockService.obterPorId.mockRejectedValue(errorObj);

    const { result } = renderHook(() => useEntidadeDetalhes<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    await act(async () => {
      await result.current.carregarEntidade(1).catch(() => { });
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao carregar detalhes:', errorObj);
    consoleErrorSpy.mockRestore();
  });
});