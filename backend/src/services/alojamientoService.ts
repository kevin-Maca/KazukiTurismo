
import {
    Alojamiento,
    AlojamientoRepository
} from '../repositories/alojamientoRepository';

export class AlojamientoService {

    private alojamientoRepository: AlojamientoRepository;

    constructor() {
        this.alojamientoRepository = new AlojamientoRepository();
    }

    async obtenerTodos(): Promise<Alojamiento[]> {
        return await this.alojamientoRepository.obtenerTodos();
    }
}
