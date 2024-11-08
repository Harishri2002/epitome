"use client"
import React from 'react';
import EventField from './EventField';
import useEventRegister from '@/store/useEventRegister';

type Props = {
    eventName: string;
    participants: number;
};

const EventGroup = ({ eventName, participants = 2 }: Props) => {
    const { displayForm } = useEventRegister()

    if (displayForm)
        return (
            <div
                data-augmented-ui="tl-clip tr-2-clip-x br-clip bl-2-clip-x"
                className='styleme relative flex flex-col gap-4 bg-blueGradientAlt p-6'>
                <span>{eventName}</span>

                {Array.from({ length: participants }).map((_, index) => (
                    <EventField key={index} index={index} eventName={eventName} participants={participants} />
                ))}
            </div>
        );
};

export default EventGroup;