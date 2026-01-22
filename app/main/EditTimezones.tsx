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
  let dropIndex = -1;

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
      const posY = e.clientY - wrapper.offsetTop; // mouse Y inside wrapper

      if (draggedElementMouseY < posY && posY < maxY) {
        const top = posY - draggedElementMouseY;
        draggedElementRef.style.top = `${top}px`;

        const draggedElementMiddleY = top + (draggedElementHeight / 2);

        let previousHeights = 0;
        refs.forEach((ref, index) => {
          if (!ref || draggedElementIndex === null || index === draggedElementIndex) {
            return;
          }

          const rect = ref.getBoundingClientRect();

          if (draggedElementMiddleY <= (previousHeights + rect.height) && draggedElementMiddleY > previousHeights) {
            ref.style.marginTop = `${draggedElementHeight}px`;
            ref.style.marginBottom = '';
            dropIndex = index > draggedElementIndex ? index - 1 : index;
          } else if (index === refs.length - 1 && draggedElementMiddleY > previousHeights) {
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
