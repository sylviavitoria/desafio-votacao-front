import { renderHook, act } from '@testing-library/react';
import useListarEntidades from '../useListarEntidades';

interface MockEntity {
  id: number;
  nome: string;
}

interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

describe('useListarEntidades', () => {
  const mockEntities: MockEntity[] = [
    { id: 1, nome: 'Entidade 1' },
    { id: 2, nome: 'Entidade 2' },
    { id: 3, nome: 'Entidade 3' }
  ];

  const mockListar = jest.fn();

  const mockService = {
    listar: mockListar
  };

  const getMockPageResponse = (
    page: number = 0,
    size: number = 10,
    total: number = 3,
    items: MockEntity[] = mockEntities
  ): PageResponse<MockEntity> => {
    const totalPages = Math.ceil(total / size);
    return {
      content: items,
      pageable: {
        pageNumber: page,
        pageSize: size
      },
      totalElements: total,
      totalPages,
      last: page >= totalPages - 1,
      first: page === 0,
      empty: items.length === 0
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockListar.mockResolvedValue(getMockPageResponse());
  });

  it('deve carregar entidades automaticamente quando carregarAutomaticamente=true', async () => {
    await act(async () => {
      renderHook(() => useListarEntidades<MockEntity>({
        service: mockService
      }));
    });

    expect(mockListar).toHaveBeenCalledTimes(1);
    expect(mockListar).toHaveBeenCalledWith(0, 10, undefined);
  });

  it('não deve carregar entidades automaticamente quando carregarAutomaticamente=false', async () => {
    await act(async () => {
      renderHook(() => useListarEntidades<MockEntity>({
        service: mockService,
        carregarAutomaticamente: false
      }));
    });

    expect(mockListar).not.toHaveBeenCalled();
  });

  it('deve configurar corretamente os parâmetros iniciais', async () => {
    const { result } = await act(async () => {
      return renderHook(() => useListarEntidades<MockEntity>({
        service: mockService,
        paginaInicial: 2,
        tamanhoPagina: 5,
        ordenacao: 'nome,asc'
      }));
    });

    expect(mockListar).toHaveBeenCalledWith(2, 5, 'nome,asc');
    expect(result.current.pagina).toBe(2);
    expect(result.current.tamanho).toBe(5);
  });

  it('deve atualizar o estado com os dados da resposta', async () => {
    const mockResponse = getMockPageResponse(0, 10, 30, mockEntities);
    mockListar.mockResolvedValue(mockResponse);

    const { result } = await act(async () => {
      return renderHook(() => useListarEntidades<MockEntity>({
        service: mockService
      }));
    });

    expect(result.current.entidades).toEqual(mockEntities);
    expect(result.current.pagina).toBe(0);
    expect(result.current.totalPaginas).toBe(3);
    expect(result.current.totalElementos).toBe(30);
    expect(result.current.ultimaPagina).toBe(false);
    expect(result.current.primeiraPagina).toBe(true);
    expect(result.current.carregando).toBe(false);
    expect(result.current.erro).toBeNull();
  });

  it('deve mudar para a próxima página corretamente', async () => {
    const { result } = renderHook(() => useListarEntidades<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    mockListar.mockClear();
    const nextPageResponse = getMockPageResponse(1, 10);
    mockListar.mockResolvedValue(nextPageResponse);

    await act(async () => {
      await result.current.mudarPagina(1);
    });

    expect(mockListar).toHaveBeenCalledWith(1, 10, undefined);
  });

  it('não deve mudar para uma página inválida (negativa)', async () => {
    const { result } = await act(async () => {
      return renderHook(() => useListarEntidades<MockEntity>({
        service: mockService
      }));
    });

    mockListar.mockClear();

    await act(async () => {
      result.current.mudarPagina(-1);
    });

    expect(mockListar).not.toHaveBeenCalled();
    expect(result.current.pagina).toBe(0);
  });

  it('não deve mudar para uma página acima do total de páginas', async () => {
    mockListar.mockResolvedValue(getMockPageResponse(0, 10, 30));
    
    const { result } = await act(async () => {
      return renderHook(() => useListarEntidades<MockEntity>({
        service: mockService
      }));
    });

    mockListar.mockClear();

    await act(async () => {
      result.current.mudarPagina(3);
    });

    expect(mockListar).not.toHaveBeenCalled();
  });

  it('deve mudar o tamanho da página corretamente', async () => {
    const { result } = await act(async () => {
      return renderHook(() => useListarEntidades<MockEntity>({
        service: mockService
      }));
    });

    const newSizeResponse = getMockPageResponse(0, 20);
    mockListar.mockResolvedValue(newSizeResponse);

    mockListar.mockClear();

    await act(async () => {
      result.current.mudarTamanhoPagina(20);
    });

    expect(mockListar).toHaveBeenCalledWith(0, 20, undefined);

    expect(result.current.tamanho).toBe(20);

    expect(result.current.pagina).toBe(0);
  });


  it('deve permitir carregar entidades manualmente', async () => {

    const { result } = renderHook(() => useListarEntidades<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    mockListar.mockClear();

    await act(async () => {
      await result.current.carregarEntidades(1, 15, 'nome,desc');
    });

    expect(mockListar).toHaveBeenCalledWith(1, 15, 'nome,desc');
  });

  it('deve definir o estado de carregando corretamente', async () => {

    let resolveListar: (value: PageResponse<MockEntity>) => void;
    const listarPromise = new Promise<PageResponse<MockEntity>>(resolve => {
      resolveListar = resolve;
    });

    mockListar.mockReturnValue(listarPromise);

    const { result } = renderHook(() => useListarEntidades<MockEntity>({
      service: mockService,
      carregarAutomaticamente: false
    }));

    const carregandoAntes = result.current.carregando;

    let promiseCarregamento: Promise<void>;
    act(() => {
      promiseCarregamento = result.current.carregarEntidades();
    });

    expect(carregandoAntes).toBe(false);
    expect(result.current.carregando).toBe(true);

    await act(async () => {
      resolveListar!(getMockPageResponse());
      await promiseCarregamento;
    });

    expect(result.current.carregando).toBe(false);
  });
});