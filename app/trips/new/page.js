'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function NewTripPage() {
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    source: '',
    destination: '',
    vehicle_id: '',
    driver_id: '',
    cargo_weight: '',
    planned_distance: '',
  })

  useEffect(() => {
    async function loadOptions() {
      setLoading(true)
      const [vehiclesRes, driversRes] = await Promise.all([
        supabase
          .from('vehicles')
          .select('id, registration_number, name_model, max_load_capacity')
          .eq('status', 'Available')
          .order('registration_number', { ascending: true }),
        supabase
          .from('drivers')
          .select('id, name, license_number')
          .eq('status', 'Available')
          .order('name', { ascending: true }),
      ])

      if (vehiclesRes.error) setError(vehiclesRes.error.message)
      if (driversRes.error) setError(driversRes.error.message)

      setVehicles(vehiclesRes.data || [])
      setDrivers(driversRes.data || [])
      setLoading(false)
    }

    loadOptions()
  }, [])

  const selectedVehicle = vehicles.find((v) => v.id === form.vehicle_id)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.source.trim() || !form.destination.trim()) {
      setError('Source and destination are required.')
      return
    }
    if (!form.vehicle_id) {
      setError('Please select a vehicle.')
      return
    }
    if (!form.driver_id) {
      setError('Please select a driver.')
      return
    }
    if (!form.cargo_weight || Number(form.cargo_weight) <= 0) {
      setError('Enter a valid cargo weight.')
      return
    }
    if (!form.planned_distance || Number(form.planned_distance) <= 0) {
      setError('Enter a valid planned distance.')
      return
    }

    if (selectedVehicle && Number(form.cargo_weight) > Number(selectedVehicle.max_load_capacity)) {
      setError(
        `Cargo weight (${form.cargo_weight}kg) exceeds ${selectedVehicle.registration_number}'s max load capacity (${selectedVehicle.max_load_capacity}kg).`
      )
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase.from('trips').insert({
      source: form.source.trim(),
      destination: form.destination.trim(),
      vehicle_id: form.vehicle_id,
      driver_id: form.driver_id,
      cargo_weight: Number(form.cargo_weight),
      planned_distance: Number(form.planned_distance),
      status: 'Draft',
    })

    setSubmitting(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess('Trip created successfully as Draft.')
    setForm({
      source: '',
      destination: '',
      vehicle_id: '',
      driver_id: '',
      cargo_weight: '',
      planned_distance: '',
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Create Trip</h1>
      <p className="text-sm text-gray-500 mb-6">
        Only vehicles and drivers currently marked Available are selectable.
      </p>

      {loading ? (
        <p className="text-gray-500">Loading available vehicles and drivers...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                name="source"
                value={form.source}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Mumbai Depot"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Pune Warehouse"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle (Available only)
            </label>
            <select
              name="vehicle_id"
              value={form.vehicle_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a vehicle...</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registration_number} — {v.name_model} (max {v.max_load_capacity}kg)
                </option>
              ))}
            </select>
            {vehicles.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No available vehicles right now.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver (Available only)
            </label>
            <select
              name="driver_id"
              value={form.driver_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a driver...</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.license_number}
                </option>
              ))}
            </select>
            {drivers.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No available drivers right now.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo Weight (kg)
              </label>
              <input
                type="number"
                name="cargo_weight"
                value={form.cargo_weight}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 450"
              />
              {selectedVehicle && (
                <p className="text-xs text-gray-400 mt-1">
                  Max for selected vehicle: {selectedVehicle.max_load_capacity}kg
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Planned Distance (km)
              </label>
              <input
                type="number"
                name="planned_distance"
                value={form.planned_distance}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 150"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-blue-600 text-white font-medium py-2.5 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Creating trip...' : 'Create Trip'}
          </button>
        </form>
      )}
    </div>
  )
}