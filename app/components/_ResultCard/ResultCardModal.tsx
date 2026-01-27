import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment } from "react";
import type { CustomMovie } from "../../../types/movies";
import Button from "../_components/Button";

interface ResultCardModalProps {
  open: boolean;
  onClose: () => void;
  movie: CustomMovie;
}

export const ResultCardModal: React.FC<ResultCardModalProps> = ({
  open,
  onClose,
  movie,
}) => (
  <Transition appear show={open} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={onClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-secondary p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="text-2xl font-bold leading-6 text-text"
              >
                {movie.title}
              </DialogTitle>
              <div className="mt-2">
                <p className="text-lg text-text">{movie.description}</p>
                {/* Add more movie details here as needed */}
                <div className="mt-4 text-sm text-text">
                  <div>
                    <strong>Release date:</strong> {movie.release_date}
                  </div>
                  <div>
                    <strong>Runtime</strong> {movie.runtime} minutes
                  </div>
                  <div>
                    <strong>Director</strong> {movie.director}
                  </div>
                  <div>
                    <strong>Actors:</strong> {movie.actors}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button onClick={onClose}>Close</Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);
