
export default async function NotesEditor({
                                       params,
                                   }: {
    params: Promise<{ slug: string }>
}) {
    const noteId = (await params).noteId
    console.log(noteId)
    return (


        <div>My Post: {noteId}</div>

    )
}