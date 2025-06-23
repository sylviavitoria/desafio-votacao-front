import { renderHook, act } from '@testing-library/react';
import useExcluirEntidade from '../useExcluirEntidade';

describe('useExcluirEntidade', () => {
    const mockExcluir = jest.fn();
    const mockService = { excluir: mockExcluir };
    const mockOnSuccess = jest.fn();
    const mockOnError = jest.fn();

    const originalConfirm = window.confirm;

    beforeEach(() => {
        jest.clearAllMocks();
        mockExcluir.mockResolvedValue(undefined);
        window.confirm = jest.fn();
    });

    afterEach(() => {
        window.confirm = originalConfirm;
    });

    it('deve iniciar com valores padrão corretos', () => {
        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService
        }));

        expect(result.current.excluindo).toBe(false);
        expect(result.current.erro).toBeNull();
        expect(typeof result.current.excluir).toBe('function');
    });

    it('deve chamar service.excluir quando o usuário confirma a exclusão', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService,
            onSuccess: mockOnSuccess
        }));

        let success;
        await act(async () => {
            success = await result.current.excluir(1);
        });

        expect(window.confirm).toHaveBeenCalled();
        expect(mockExcluir).toHaveBeenCalledWith(1);
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(success).toBe(true);
    });

    it('deve usar a mensagem de confirmação padrão quando não fornecida', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService
        }));

        await act(async () => {
            await result.current.excluir(1);
        });

        expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este item?');
    });

    it('deve usar a mensagem de confirmação personalizada quando fornecida', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        const mensagemPersonalizada = 'Tem certeza que deseja excluir este teste?';

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService,
            mensagemConfirmacao: mensagemPersonalizada
        }));

        await act(async () => {
            await result.current.excluir(1);
        });

        expect(window.confirm).toHaveBeenCalledWith(mensagemPersonalizada);
    });

    it('deve pular a confirmação quando confirmar=false', async () => {
        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService
        }));

        await act(async () => {
            await result.current.excluir(1, false);
        });

        expect(window.confirm).not.toHaveBeenCalled();
        expect(mockExcluir).toHaveBeenCalledWith(1);
    });

    it('deve definir erro quando service.excluir falha', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        const errorMessage = 'Erro ao excluir';
        mockExcluir.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService,
            onError: mockOnError
        }));

        let success;
        await act(async () => {
            success = await result.current.excluir(1);
        });

        expect(result.current.erro).toBe(errorMessage);
        expect(mockOnError).toHaveBeenCalledWith(errorMessage);
        expect(success).toBe(false);
    });

    it('deve definir mensagem genérica de erro quando error não é instância de Error', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        mockExcluir.mockRejectedValue("String de erro");

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService,
            onError: mockOnError
        }));

        await act(async () => {
            await result.current.excluir(1);
        });

        expect(result.current.erro).toBe('Erro ao excluir item');
        expect(mockOnError).toHaveBeenCalledWith('Erro ao excluir item');
    });

    it('deve definir excluindo como true durante a exclusão', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);

        let resolvePromise: (value: void) => void;
        const excluirPromise = new Promise<void>(resolve => {
            resolvePromise = resolve;
        });

        mockExcluir.mockReturnValue(excluirPromise);

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService
        }));

        expect(result.current.excluindo).toBe(false);

        let excluirFuncPromise: Promise<boolean>;
        act(() => {
            excluirFuncPromise = result.current.excluir(1);
        });

        expect(result.current.excluindo).toBe(true);

        await act(async () => {
            resolvePromise!();
            await excluirFuncPromise;
        });

        expect(result.current.excluindo).toBe(false);
    });

    it('deve resetar excluindo para false mesmo quando há erro', async () => {
        (window.confirm as jest.Mock).mockReturnValue(true);
        mockExcluir.mockRejectedValue(new Error('Erro ao excluir'));

        const { result } = renderHook(() => useExcluirEntidade({
            service: mockService
        }));

        await act(async () => {
            await result.current.excluir(1).catch(() => { });
        });

        expect(result.current.excluindo).toBe(false);
    });
});