package com.presentacion.ms_patron.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.presentacion.ms_patron.config.RabbitMQConsumerConfig;
import com.presentacion.ms_patron.listener.objects.VotoEvent;
import com.presentacion.ms_patron.service.CiudadanoService;

@Component
public class VotoListener {

    private final CiudadanoService ciudadanoService;

    public VotoListener(CiudadanoService ciudadanoService) {
        this.ciudadanoService = ciudadanoService;
    }

    @RabbitListener(queues = RabbitMQConsumerConfig.QUEUE)
    public void recibirVoto(VotoEvent evento) {

        ciudadanoService.marcarYaVoto(evento.getDniCiudadano());

        System.out.println("Evento de voto recibido: idVoto=" + evento.getIdVoto()
                + ", dniCiudadano=" + evento.getDniCiudadano());
    }
}

