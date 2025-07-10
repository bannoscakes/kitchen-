import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Kitchen Scanner for Cake Production Workflow
function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [selectedStage, setSelectedStage] = useState('');
  const [assignedBaker, setAssignedBaker] = useState('');
  const [orders, setOrders] = useState([
    {
      scheduleId: 'SCH001',
      orderId: 'ORD001',
      scheduledDate: '2025-07-09',
      status: 'In Progress',
      assignedBaker: 'Sarah',
      currentStage: 'Filling',
      specialInstructions: 'Extra vanilla, gluten-free',
      productImage: '',
      fillingComplete: null,
      coveringComplete: null,
      decorationComplete: null,
      packingNotes: ''
    },
    {
      scheduleId: 'SCH002',
      orderId: 'ORD002',
      scheduledDate: '2025-07-09',
      status: 'In Progress',
      assignedBaker: 'Mike',
      currentStage: 'Covering',
      specialInstructions: 'Chocolate ganache',
      productImage: '',
      fillingComplete: '2025-07-09T09:30:00Z',
      coveringComplete: null,
      decorationComplete: null,
      packingNotes: ''
    }
  ]);

  const videoRef = useRef(null);
  const stages = ['Filling', 'Covering', 'Decoration', 'Packing', 'Complete'];
  const bakers = ['Sarah', 'Mike', 'Emma', 'David', 'Lisa'];

  // Camera scanning functions
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsScanning(true);
        
        // Simulate barcode detection (replace with QuaggaJS in production)
        setTimeout(() => {
          simulateBarcodeDetection();
        }, 3000);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      alert('Camera access required for barcode scanning');
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const simulateBarcodeDetection = () => {
    const mockBarcodes = ['SCH001', 'SCH002', 'ORD001', 'ORD002'];
    const detectedCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)];
    
    setScanResult(detectedCode);
    stopScanning();
    
    // Find order by schedule ID or order ID
    const order = orders.find(o => o.scheduleId === detectedCode || o.orderId === detectedCode);
    if (order) {
      setCurrentOrder(order);
      setSelectedStage(order.currentStage);
      setAssignedBaker(order.assignedBaker);
    }
  };

  const updateOrderStage = () => {
    if (!currentOrder || !selectedStage) return;

    const timestamp = new Date().toISOString();
    const updatedOrders = orders.map(order => {
      if (order.scheduleId === currentOrder.scheduleId) {
        let updates = {
          ...order,
          currentStage: selectedStage,
          assignedBaker: assignedBaker
        };

        // Update completion timestamps
        switch (selectedStage) {
          case 'Covering':
            updates.fillingComplete = updates.fillingComplete || timestamp;
            break;
          case 'Decoration':
            updates.coveringComplete = updates.coveringComplete || timestamp;
            break;
          case 'Packing':
            updates.decorationComplete = updates.decorationComplete || timestamp;
            break;
          case 'Complete':
            updates.packingComplete = timestamp;
            updates.status = 'Complete';
            break;
        }

        return updates;
      }
      return order;
    });

    setOrders(updatedOrders);
    
    // Reset form
    setCurrentOrder(null);
    setScanResult(null);
    setSelectedStage('');
    
    alert(`Order ${currentOrder.orderId} updated to ${selectedStage} stage!`);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Filling': 'bg-yellow-100 text-yellow-800',
      'Covering': 'bg-blue-100 text-blue-800', 
      'Decoration': 'bg-purple-100 text-purple-800',
      'Packing': 'bg-green-100 text-green-800',
      'Complete': 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f0f9ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            backgroundColor: '#10b981', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>🎂</div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#374151', margin: 0 }}>
            Cake Production Scanner
          </h1>
        </div>

        {/* Barcode Scanner */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={isScanning ? stopScanning : startScanning}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: isScanning ? '#ef4444' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            📷 {isScanning ? 'Stop Scanning' : 'Scan Order Barcode'}
          </button>

          {scanResult && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#d1fae5',
              borderRadius: '8px',
              color: '#065f46'
            }}>
              ✅ Scanned: {scanResult}
            </div>
          )}
        </div>

        {/* Camera View */}
        {isScanning && (
          <div style={{ position: 'relative', backgroundColor: 'black', borderRadius: '12px', overflow: 'hidden' }}>
            <video
              ref={videoRef}
              style={{ width: '100%', height: '240px', objectFit: 'cover' }}
              autoPlay
              playsInline
              muted
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '100px',
              border: '3px solid #10b981',
              borderRadius: '8px',
              opacity: 0.8
            }} />
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              color: 'white',
              textAlign: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              padding: '8px',
              borderRadius: '6px'
            }}>
              Position barcode in the frame
            </div>
          </div>
        )}

        {/* Order Update Form */}
        {currentOrder && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            border: '2px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#374151' }}>
              Update Order: {currentOrder.orderId}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <p><strong>Current Stage:</strong> {currentOrder.currentStage}</p>
              <p><strong>Assigned Baker:</strong> {currentOrder.assignedBaker}</p>
              <p><strong>Instructions:</strong> {currentOrder.specialInstructions}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  New Stage:
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Assigned Baker:
                </label>
                <select
                  value={assignedBaker}
                  onChange={(e) => setAssignedBaker(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px'
                  }}
                >
                  {bakers.map(baker => (
                    <option key={baker} value={baker}>{baker}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={updateOrderStage}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Update Order Stage
            </button>
          </div>
        )}
      </div>

      {/* Current Orders */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '24px'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#374151' }}>
          Today's Production Orders
        </h2>
        
        <div style={{ display: 'grid', gap: '16px' }}>
          {orders.map(order => (
            <div key={order.scheduleId} style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>
                  {order.orderId} - {order.scheduleId}
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }} className={getStageColor(order.currentStage)}>
                  {order.currentStage}
                </span>
              </div>
              
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                <p><strong>Baker:</strong> {order.assignedBaker}</p>
                <p><strong>Instructions:</strong> {order.specialInstructions}</p>
                <p><strong>Scheduled:</strong> {order.scheduledDate}</p>
              </div>

              <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <span>Filling: {order.fillingComplete ? '✅' : '⏳'}</span>
                  <span>Covering: {order.coveringComplete ? '✅' : '⏳'}</span>
                  <span>Decoration: {order.decorationComplete ? '✅' : '⏳'}</span>
                  <span>Packing: {order.packingComplete ? '✅' : '⏳'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;