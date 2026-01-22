import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import { TIME_ZONES } from '~/lib/timezones';
import { DeleteIcon } from '~/lib/icons/DeleteIcon';
import { BarsIcon } from '~/lib/icons/BarsIcon';

import './EditTimezones.css';

type EditTimezonesProps = {
  timezones: string[];
  onSave: (timezones: string[]) => void;
  onCancel: () => void;
};

export const EditTimezones: React.FC<EditTimezonesProps> = ({ timezones: initialTimezones, onSave, onCancel }) => {
  const [timezones, setTimezones] = useState(initialTimezones);
  const [zone, setZone] = useState<string>('');

  let draggedElementIndex = -1;
  let draggedElementHeight = 0;
  let draggedElementMouseY = 0;
  const itemsWrapperRef = useRef(null);

  let dropIndex = -1;
  let refs: (HTMLElement)[] = [];

  const onMoveEvent = (clientY: number, draggedElementIndex: number, draggedElementHeight: number, draggedElementMouseY: number) => {
    if (refs === null || draggedElementIndex < 0 || !itemsWrapperRef.current) {
      return;
    }

    const allItemsHeight = refs.reduce((acc, current) => (acc + current.clientHeight), 0);

    const wrapper = (itemsWrapperRef.current as HTMLElement);
    const maxY = allItemsHeight - draggedElementHeight + draggedElementMouseY;
    const posY = clientY - wrapper.offsetTop; // mouse Y inside wrapper

    if (draggedElementMouseY <= posY && posY <= maxY) {
      const top = posY - draggedElementMouseY;
      refs[draggedElementIndex].style.top = `${top}px`;

      const draggedElementMiddleY = top + (draggedElementHeight / 2);

      let previousHeights = 0;
      refs.forEach((ref, index) => {
        if (!ref || draggedElementIndex < 0 || index === draggedElementIndex) {
          return;
        }

        const rect = ref.getBoundingClientRect();

        const isLastItem = (index === refs.length - 1) || (index === refs.length - 2 && draggedElementIndex == refs.length - 1);
        if (draggedElementMiddleY <= (previousHeights + rect.height) && draggedElementMiddleY > previousHeights) {
          ref.style.marginTop = `${draggedElementHeight}px`;
          ref.style.marginBottom = '';
          dropIndex = index > draggedElementIndex ? index - 1 : index;
        } else if (isLastItem && draggedElementMiddleY > previousHeights) {
          ref.style.marginTop = '';
          ref.style.marginBottom = `${draggedElementHeight}px`;
          dropIndex = refs.length - 1;
        } else {
          ref.style.marginTop = '';
          ref.style.marginBottom = '';
        }
        previousHeights += rect.height;
      });
    }
  };

  useEffect(() => {
    const onBodyMouseMove = (e: MouseEvent) => {
      onMoveEvent(e.clientY, draggedElementIndex, draggedElementHeight, draggedElementMouseY);
    };

    const onBodyMouseUp = () => {
      if (dropIndex < 0 || draggedElementIndex < 0 || itemsWrapperRef.current === null) {
        return;
      }
      refs[draggedElementIndex].style.top = '';
      refs[draggedElementIndex].style.position = '';

      refs.forEach((ref) => {
        ref.style.marginTop = '';
        ref.style.marginBottom = '';
      });

      (itemsWrapperRef.current as HTMLElement).style.userSelect = '';

      if (dropIndex !== draggedElementIndex) {
        setTimezones(moveDraggedElement(timezones, dropIndex, draggedElementIndex));
      }

      draggedElementIndex = -1;
    };

    document.body.addEventListener('mousemove', onBodyMouseMove);
    document.body.addEventListener('touchmove', (e) => {
      console.log('touch', e); // e.touches[0].clientY
    });
    document.body.addEventListener('mouseup', onBodyMouseUp);

    return () => {
      document.body.removeEventListener('mousemove', onBodyMouseMove);
      document.body.removeEventListener('mouseup', onBodyMouseUp);
    }
  });

  function moveDraggedElement<T>(array: T[], dropIndex: number, draggedElementIndex: number): T[] {
    const newArray = [];
    for (let i = 0; i < array.length; i++) {
      if (i === draggedElementIndex) {
        continue;
      }
      if (i === dropIndex) {
        if (dropIndex < draggedElementIndex) {
          newArray.push(array[draggedElementIndex]);
          newArray.push(array[i]);
        } else {
          newArray.push(array[i]);
          newArray.push(array[draggedElementIndex]);
        }
        continue;
      }
      newArray.push(array[i]);
    }
    return newArray;
  }

  const onGripMouseDown = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    draggedElementIndex = index;
    const ref = refs[index];
    ref.style.position = 'absolute';
    if (!ref || !itemsWrapperRef.current) {
      return;
    }
    draggedElementHeight = ref.offsetHeight;
    const mouseY = e.clientY - ref.getBoundingClientRect().top;
    draggedElementMouseY = mouseY;

    const itemsWrapper = (itemsWrapperRef.current as HTMLElement);
    const posY = e.clientY - itemsWrapper.offsetTop;
    ref.style.top = `${posY - draggedElementMouseY}px`;

    itemsWrapper.style.userSelect = 'none';

    onMoveEvent(e.clientY, index, ref.offsetHeight, mouseY);
  };

  return (
    <div className={`edit-timezones bg-amber-100 shadow-lg border-gray-400 rounded px-3 py-3 max-w-full`}>
      <h2 className="text-lg mb-6 font-bold">Edit timezones</h2>

      <div ref={itemsWrapperRef} className="relative overflow-auto">
        {timezones.map((item, index) => {
          return (
            <React.Fragment key={item}>
              <div
                ref={(el) => {
                  if (el) {
                    refs[index] = el;
                  }
                }}
                className={`flex justify-between items-center gap-2 py-1 w-full`}
              >
                <div className="flex items-center">
                  <div className="opacity-25 mr-2" onMouseDown={(e) => onGripMouseDown(e, index)}>
                    <BarsIcon />
                  </div>
                  <div className="break-all leading-none">
                    {item}
                  </div>
                </div>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setTimezones(timezones.toSpliced(index, 1));
                  }}
                >
                  <DeleteIcon/>
                </Button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex gap-2 pt-6">
        <Autocomplete
          className="flex-grow"
          options={TIME_ZONES}
          value={zone}
          onChange={(e, value) => {
            setZone(value ?? '');
          }}
          renderInput={(params) => <TextField {...params} label="Timezone name" />}
          size="small"
        />
        <Button
          variant="outlined"
          onClick={() => {
            if (zone !== null) {
              setTimezones([...timezones, zone]);
            }
          }}
        >Add</Button>
      </div>

      <div className="flex mt-6 gap-2">
        <Button
          variant="contained"
          onClick={() => {
            onSave(timezones);
          }}
        >Save</Button>
        <Button
          variant="outlined"
          onClick={onCancel}
        >Cancel</Button>
      </div>
    </div>
  );
};
