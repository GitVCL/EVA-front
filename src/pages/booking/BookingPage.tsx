import React from 'react';
import AppLayout from '../../components/AppLayout';
import BookingStepper from '../../components/BookingStepper';
import { useBooking } from '../../contexts/BookingContext';
import BookingClassStep from './BookingClassStep';
import BookingDateStep from './BookingDateStep';
import BookingTimeStep from './BookingTimeStep';
import BookingInfoStep from './BookingInfoStep';
import BookingConfirmStep from './BookingConfirmStep';

const BookingPage: React.FC = () => {
  const { state } = useBooking();

  return (
    <AppLayout variant="public" title="Agendar aula" showBack={state.step !== 'class'}>
      <div className="w-full px-4 pt-4 pb-4 flex flex-col gap-4">
        <BookingStepper current={state.step} />

        <div className="mt-1">
          {state.step === 'class' && <BookingClassStep />}
          {state.step === 'date' && <BookingDateStep />}
          {state.step === 'time' && <BookingTimeStep />}
          {state.step === 'info' && <BookingInfoStep />}
          {state.step === 'confirm' && <BookingConfirmStep />}
        </div>
      </div>
    </AppLayout>
  );
};

export default BookingPage;
