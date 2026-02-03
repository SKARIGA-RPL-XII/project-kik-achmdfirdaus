export default function WorkClock() {
    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 className="text-4xl font-bold mb-6">07 : 57 : 43</h2>

            <div className="flex justify-between text-sm text-gray-600">
                <div>
                    <p>Masuk</p>
                    <p className="font-semibold">09.00</p>
                </div>

                <div>
                    <p>Pulang</p>
                    <p className="font-semibold">16.00</p>
                </div>
            </div>
        </div>
    )
}
