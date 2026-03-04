"use client";

import React from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

const MIN_YEAR = 1940;
const MAX_YEAR = new Date().getFullYear();

type YearRangeSelectorProps = {
    onChange?: (range: [number, number]) => void;
    init_value?: [number, number];
};

export default function YearRangeSelector({
    onChange,
    init_value = [2000, MAX_YEAR],
}: YearRangeSelectorProps) {

    const [value, setValue] = React.useState<[number, number]>(init_value);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-center text-sm gap-1 font-semibold">
                <span className="text-violet-400">{value[0]}</span>
                <span className="text-slate-400 text-sm self-center">-</span>
                <span className="text-sky-400">{value[1]}</span>
            </div>

            <RangeSlider
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={value}
                rangeSlideDisabled={true}
                onInput={(range) => {
                    const updated: [number, number] = [range[0], range[1]];
                    setValue(updated);
                    onChange?.(updated);
                }}
            />

            <div className="flex justify-between text-sm text-slate-500">
                <span>{MIN_YEAR}</span>
                <span>{MAX_YEAR}</span>
            </div>
        </div>
    );
}