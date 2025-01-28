import CodingNotesList from "@/app/components/CodingNotesList";
import NotesEditor from "@/app/components/NotesEditor";

export default function Home() {


     interface notesDataTypes {
        name: string;
        content: string;
        id: number;
    }


    const notesData: notesDataTypes[] = [
        {name: "first",
            content: "First note",
        id:1},

        {name: "second",
            content: "Second note",
        id:2},
    ]
  return (

          <div >

              <NotesEditor notesData={notesData} />




          </div>




  );
}
