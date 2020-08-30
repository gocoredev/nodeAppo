import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
import {startOfHour} from 'date-fns'
import {getCustomRepository} from 'typeorm'
/* 
/*  Recebimento de Informações 
/* Tratativas de erros
Acesso
*/

interface RequestDto{
    date: Date;
    provider_id: string;
}


/* Dependency Inversion */

class CreateAppointmentService {

    public async  execute({date, provider_id}:RequestDto): Promise<Appointment> {

        const appointmentsRepository = getCustomRepository(AppointmentsRepository)

        const appointmentDate = startOfHour(date)

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate)

        if(findAppointmentInSameDate) {
            
            throw Error('Horario já ocupado')
        }

        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate
        })

        await appointmentsRepository.save(appointment)

        return appointment;
    }

}


export default CreateAppointmentService