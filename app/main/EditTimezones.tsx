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

  const [draggedElementIndex, setDraggedElementIndex] = useState<number | null>(null);
  const [draggedElementHeight, setDraggedElementHeight] = useState<number>(0);
  const [draggedElementMouseY, setDraggedElementMouseY] = useState<number>(0);
  const [draggedElementRef, setDraggedElementRef] = useState<HTMLElement | null>();
  const itemsWrapperRef = useRef(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  let refs: (HTMLElement | null)[] = [];

  useEffect(() => {
    // const onMoveEvent = () => {
    //
    // };

    const onBodyMouseMove = (e: MouseEvent) => {
      if (!draggedElementRef || !itemsWrapperRef.current) {
        return;
      }
      const wrapper = (itemsWrapperRef.current as HTMLElement);
      const maxY = wrapper.clientHeight - draggedElementHeight + draggedElementMouseY;
      const posY = e.clientY - wrapper.offsetTop;

      if (draggedElementMouseY < posY && posY < maxY) {
        const top = posY - draggedElementMouseY;
        draggedElementRef.style.top = `${top}px`;

        refs.forEach((ref, index) => {
          if (!ref) {
            return;
          }
          const rect = ref.getBoundingClientRect();
          const mouseY = e.clientY - draggedElementMouseY;
          // console.log(rect.top, e.clientY, rect.bottom);
          if ((rect.top + rect.height / 2) <= mouseY && mouseY <= (rect.bottom + rect.height / 2)) {
            ref.style.marginTop = '';
            ref.style.marginBottom = `${draggedElementHeight}px`;
            setDropIndex(index);
            console.log('a; dropIndex:', index);
          } else if (mouseY < (rect.top + rect.height / 2) && index === 0) {
            ref.style.marginTop = `${draggedElementHeight}px`;
            ref.style.marginBottom = '';
            setDropIndex(0);
            console.log('b; dropIndex: 0');
          } else {
            ref.style.marginBottom = '';
            ref.style.marginTop = '';
          }
        });
      }
    };
    const onBodyMouseUp = () => {
      if (!draggedElementRef || dropIndex === null || draggedElementIndex === null) {
        return;
      }
      draggedElementRef.style.top = '';

      setTimezones(moveDraggedElement(timezones, dropIndex, draggedElementIndex));

      setDraggedElementIndex(null);
      setDraggedElementRef(null);

      refs.forEach((ref) => {
        if (!ref) {
          return;
        }
        ref.style.marginTop = '';
        ref.style.marginBottom = '';
      });
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
      if (i === dropIndex) {
        newArray.push(array[draggedElementIndex]);
      }
      if (i === draggedElementIndex) {
        continue;
      }
      newArray.push(array[i]);
    }
    return newArray;
  }

  const onGripMouseDown = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    setDraggedElementIndex(index);
    const ref = refs[index];
    if (!ref || !itemsWrapperRef.current) {
      return;
    }
    setDraggedElementRef(ref);
    setDraggedElementHeight(ref.offsetHeight || 0);
    const mouseY = e.clientY - ref.getBoundingClientRect().top;
    setDraggedElementMouseY(mouseY);

    const posY = e.clientY - (itemsWrapperRef.current as HTMLElement).offsetTop;
    ref.style.top = `${posY - mouseY}px`;
  };

  const noSelectClass = draggedElementIndex !== null ? 'select-none' : '';

  return (
    <div className={`edit-timezones bg-amber-100 shadow-lg border-gray-400 rounded px-3 py-3 max-w-full ${noSelectClass}`}>
      <h2 className="text-lg mb-6 font-bold">Edit timezones</h2>

      <div ref={itemsWrapperRef} className="relative border border-black">
        {timezones.map((item, index) => {
          // let dummyItem = null;
          let itemDraggedClass = '';
          if (draggedElementIndex === index) {
            // dummyItem = <div className="py-1" style={{ height: `${draggedElementHeight}px` }}/>;
            itemDraggedClass = 'dragged';
          }

          return (
            <React.Fragment key={item}>
              {/*{dummyItem}*/}
              <div
                ref={(el) => {
                  refs.push(el);
                }}
                className={`flex justify-between items-center gap-2 py-1 w-full ${itemDraggedClass}`}
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
