import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import {startOfHour} from 'date-fns'
/* 
/*  Recebimento de Informações 
/* Tratativas de erros
Acesso
*/

interface RequestDto{
    date: Date;
    provider: string;
}


/* Dependency Inversion */

class CreateAppointmentService {
    private appointmentsRepository: AppointmentsRepository

    constructor(appointmentsRepository: AppointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository
    }

    public execute({date, provider}:RequestDto): Appointment {
        const appointmentDate = startOfHour(date)

        const findAppointmentInSameDate = this.appointmentsRepository.findByDate(appointmentDate)

        if(findAppointmentInSameDate) {
            
            throw Error('Horario já ocupado')
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate
        })

        return appointment;
    }

}


export default CreateAppointmentService