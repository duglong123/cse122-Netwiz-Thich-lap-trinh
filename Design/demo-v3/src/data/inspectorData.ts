export interface TelemetryField {
  key: string;
  value: string;
}

export type VisualizerMode =
  | 'pipeline'
  | 'topology'
  | 'encapsulation'
  | 'handshake-cidr'
  | 'security-perimeter';

export interface InspectorLayer {
  id: string;
  shortTag: string;
  label: string;
  name: string;
  value: string;
  protocolPrompt: string;
  telemetry: TelemetryField[];
  code: string;
  note: string;
}

export interface ChapterVisualTheme {
  number: string;
  alias: string;
  sector: string;
  color: string;
  rgb: string;
  mode: VisualizerMode;
  stageBadge: string;
  inspectorTitle: string;
  coreTitle: string;
  coreSub: string;
  layers: InspectorLayer[];
}

export const CHAPTER_THEMES: Record<string, ChapterVisualTheme> = {
  'ch-1': {
    number: '01',
    alias: 'Signal Vanguard',
    sector: 'Sector 01 // Physical Edge',
    color: 'var(--ch-1)',
    rgb: 'var(--ch-1-rgb)',
    mode: 'pipeline',
    stageBadge: 'PACKET PIPELINE // R1 -> R2',
    inspectorTitle: 'End-to-End Packet Switching & Delay Pipeline',
    coreTitle: '2 ms / 10 Mbps',
    coreSub: 'd_nodal = d_proc + d_queue + L/R + d/s',
    layers: [
      {
        id: 'p-host',
        shortTag: 'HOST L',
        label: '10.0.1.5 → 10.0.9.8',
        name: 'Host Payload Segmentation (L)',
        value: 'L = 12,000 bits',
        protocolPrompt: 'traceroute -n 10.0.9.8 # pkt-gen',
        telemetry: [
          { key: 'SRC', value: '10.0.1.5' },
          { key: 'DST', value: '10.0.9.8' },
          { key: 'SIZE', value: '1,500 B (12 kb)' },
        ],
        code: `$ pkt-capture --src 10.0.1.5 --dst 10.0.9.8\nIPv4 proto=TCP ttl=64 len=1500B (12,000 bits)\nmode=Packet-Switching (statistical multiplexing)`,
        note: 'Dữ liệu được chia thành từng gói độc lập (Packet Switching) kèm địa chỉ đích thay vì chiếm dụng kênh cố định như Circuit Switching.',
      },
      {
        id: 'p-tx',
        shortTag: 'TX L/R',
        label: 'eth0 Link Serialization',
        name: 'Transmission Delay (L/R)',
        value: '2.0 ms @ 6 Mbps',
        protocolPrompt: 'ethtool eth0 | grep -E "Speed|Link"',
        telemetry: [
          { key: 'RATE (R)', value: '6 Mbps' },
          { key: 'DELAY', value: 'L/R = 2.0 ms' },
          { key: 'MEDIUM', value: 'UTP Cat6' },
        ],
        code: `IFACE eth0  Link: UP  Speed: 6 Mbps Full-Duplex\nd_trans = L / R = 12,000 bits / 6,000,000 bps\nd_trans = 0.0020 s (2.0 ms serialization delay)`,
        note: 'Transmission Delay (L/R) là thời gian đẩy toàn bộ các bit của gói tin lên đường truyền có tốc độ R.',
      },
      {
        id: 'p-queue',
        shortTag: 'QUEUE',
        label: 'Router R1 Buffer',
        name: 'Store-and-Forward Buffer',
        value: 'Store & Forward',
        protocolPrompt: 'show interfaces Gi0/1 | inc drops|queue',
        telemetry: [
          { key: 'MODE', value: 'Store-and-Forward' },
          { key: 'QUEUE', value: '48 / 64 pkts' },
          { key: 'DROP', value: 'Tail-Drop if full' },
        ],
        code: `R1# show interfaces GigabitEthernet0/1\n  Input queue: 48/64/0/0 (size/max/drops/flushes)\n  Output queue: 12/40 (store-and-forward active)`,
        note: 'Router nhận trọn vẹn gói tin trước khi chuyển tiếp. Khi lưu lượng đến vượt tốc độ ra, hàng đợi đầy sẽ gây Packet Loss.',
      },
      {
        id: 'p-bottleneck',
        shortTag: 'MIN(R)',
        label: 'Path Bottleneck',
        name: 'End-to-End Bottleneck Throughput',
        value: 'min(R1, R2, R3) = 10 Mbps',
        protocolPrompt: 'iperf3 -c 10.0.9.8 -t 5',
        telemetry: [
          { key: 'HOP 1', value: '100 Mbps' },
          { key: 'HOP 2', value: '10 Mbps (BOTTLENECK)' },
          { key: 'HOP 3', value: '1,000 Mbps' },
        ],
        code: `[SUM] 0.00-5.00 sec  5.96 MBytes  10.0 Mbits/sec\n# Throughput = min(100 Mbps, 10 Mbps, 1000 Mbps)\n# Bottleneck link R2 caps end-to-end bandwidth`,
        note: 'Thông lượng đầu-cuối thực tế luôn bị giới hạn bởi chặng có băng thông nhỏ nhất (nút cổ chai) trên toàn tuyến.',
      },
    ],
  },
  'ch-2': {
    number: '02',
    alias: 'Topology Architect',
    sector: 'Sector 02 // Structural Grid',
    color: 'var(--ch-2)',
    rgb: 'var(--ch-2-rgb)',
    mode: 'topology',
    stageBadge: 'TOPOLOGY SCHEMATIC // 4 ARCHITECTURES',
    inspectorTitle: 'Interactive Network Topology Schematic',
    coreTitle: 'N(N-1) / 2 Links',
    coreSub: 'Bus • Star • Full Mesh • Spine-Leaf',
    layers: [
      {
        id: 'bus',
        shortTag: 'BUS',
        label: 'Shared Coax Backbone',
        name: 'Shared Bus Topology',
        value: '1 Trunk · SPOF',
        protocolPrompt: 'net-topo inspect --mode bus --nodes 4',
        telemetry: [
          { key: 'CABLING', value: '1 Shared Trunk' },
          { key: 'COLLISION', value: 'CSMA/CD Domain' },
          { key: 'SPOF', value: 'Main Backbone' },
        ],
        code: `TOPOLOGY: BUS (IEEE 802.3 10BASE2)\nTerminators: 50 Ohm [LEFT] --- [RIGHT] OK\nALERT: Backbone break isolates all 4 stations`,
        note: 'Chi phí cáp thấp nhất nhưng toàn bộ node dùng chung một miền xung đột; đứt trục chính sẽ làm gián đoạn cả phân đoạn.',
      },
      {
        id: 'star',
        shortTag: 'STAR',
        label: 'Centralized Switch',
        name: 'Centralized Star Topology',
        value: 'N Links · Isolated',
        protocolPrompt: 'SW-CORE# show spanning-tree summary',
        telemetry: [
          { key: 'LINKS', value: '4 Point-to-Point' },
          { key: 'FAULT', value: 'Per-port Isolation' },
          { key: 'SPOF', value: 'Central Switch' },
        ],
        code: `SW-CORE# show interfaces status\nGi0/1  PC-A  connected  1000Mb/s  full\nGi0/2  PC-B  connected  1000Mb/s  full\n# Cable fault on Gi0/1 affects PC-A only`,
        note: 'Cô lập lỗi từng nhánh cáp rất tốt; tuy nhiên cần nguồn hoặc Switch dự phòng để tránh điểm lỗi đơn tại trung tâm.',
      },
      {
        id: 'full-mesh',
        shortTag: 'MESH',
        label: 'Full Mesh Redundancy',
        name: 'Full Mesh Topology',
        value: 'N(N-1)/2 = 6 Links',
        protocolPrompt: 'R1# show ip ospf neighbor',
        telemetry: [
          { key: 'NODES (N)', value: '4 Routers' },
          { key: 'LINKS', value: '4×3/2 = 6 Direct' },
          { key: 'RESILIENCE', value: 'Multi-path Failover' },
        ],
        code: `R1# show ip ospf neighbor\nNeighbor ID   State     Interface\n2.2.2.2       FULL/P2P  Gi0/0\n3.3.3.3       FULL/P2P  Gi0/1\n4.4.4.4       FULL/P2P  Gi0/2  # Formula: N*(N-1)/2`,
        note: 'Độ dự phòng tối đa với kết nối trực tiếp từng đôi một, nhưng số cổng và dây cáp tăng theo O(N²) khi mở rộng mạng.',
      },
      {
        id: 'spine-leaf',
        shortTag: 'SPINE-LEAF',
        label: 'Data Center Fabric',
        name: 'Spine-Leaf 2-Tier Fabric',
        value: '2-Hop East-West',
        protocolPrompt: 'LEAF-1# show bgp l2vpn evpn summary',
        telemetry: [
          { key: 'HOPS', value: '2-Hop Uniform' },
          { key: 'UPSTREAM', value: 'ECMP to All Spines' },
          { key: 'BLOCKING', value: 'Non-Blocking Fabric' },
        ],
        code: `FABRIC: 2 Spines x 3 Leafs (ECMP Active)\nPath Leaf-1 -> Spine-1/2 -> Leaf-3: 2 hops (0.18 ms)\nEast-West latency uniform across all racks`,
        note: 'Kiến trúc Data Center 2 tầng không nghẽn: mọi Leaf kết nối tới mọi Spine giúp lưu lượng East-West luôn đi qua đúng 2 chặng.',
      },
    ],
  },
  'ch-3': {
    number: '03',
    alias: 'Seven-Layer Sentinel',
    sector: 'Sector 03 // OSI Core',
    color: 'var(--ch-3)',
    rgb: 'var(--ch-3-rgb)',
    mode: 'encapsulation',
    stageBadge: 'ENCAPSULATION + WIRE FRAME DISSECTOR',
    inspectorTitle: 'OSI Encapsulation & Wire Frame Dissector',
    coreTitle: 'Data → Segment → Packet → Frame → Bits',
    coreSub: 'L7 Application → L1 Physical',
    layers: [
      {
        id: 'osi-l7',
        shortTag: 'L7..L5',
        label: 'App · Presentation · Session',
        name: 'Application Data & TLS',
        value: 'PDU: Data (HTTP/TLS)',
        protocolPrompt: 'tshark -Y "http2 || tls" -V',
        telemetry: [
          { key: 'PDU', value: 'Data / Payload' },
          { key: 'PROTOCOLS', value: 'HTTP, TLS 1.3, DNS' },
          { key: 'ROLE', value: 'Syntax & Session' },
        ],
        code: `Hypertext Transfer Protocol (L7)\n  GET /api/v1/lessons HTTP/1.1\\r\\nHost: netwiz.edu\nTransport Layer Security (L6): TLSv1.3 AES-256-GCM\nSession Control (L5): Session-ID=0x9a4f checkpoint`,
        note: 'Tầng 7 cung cấp giao diện ứng dụng; Tầng 6 mã hóa/nén chuẩn dữ liệu; Tầng 5 thiết lập và đồng bộ phiên đối thoại.',
      },
      {
        id: 'osi-l4',
        shortTag: 'L4',
        label: 'Transport Layer',
        name: 'Segment + Port Header',
        value: 'PDU: Segment (TCP:443)',
        protocolPrompt: 'tshark -Y "tcp.port == 443" -T fields',
        telemetry: [
          { key: 'PDU', value: 'Segment / Datagram' },
          { key: 'SRC PORT', value: '51422' },
          { key: 'DST PORT', value: '443 (HTTPS)' },
        ],
        code: `Transmission Control Protocol (L4)\n  Src Port: 51422, Dst Port: 443, Seq: 1, Ack: 1\n  Header Len: 20 bytes, Flags: [PSH, ACK], Win: 64240`,
        note: 'Đóng gói Data thành Segment (TCP) hoặc Datagram (UDP), gắn số Port nguồn/đích để định danh đúng tiến trình ứng dụng.',
      },
      {
        id: 'osi-l3',
        shortTag: 'L3',
        label: 'Network Layer',
        name: 'Packet + IP Routing',
        value: 'PDU: Packet (IPv4)',
        protocolPrompt: 'ip route get 93.184.216.34',
        telemetry: [
          { key: 'PDU', value: 'Packet' },
          { key: 'SRC IP', value: '192.168.1.10' },
          { key: 'DST IP', value: '93.184.216.34' },
        ],
        code: `Internet Protocol Version 4 (L3)\n  Src: 192.168.1.10 -> Dst: 93.184.216.34\n  TTL: 64, Protocol: TCP (6), Total Length: 512\n# IP end-to-end stays intact across Routers (no NAT)`,
        note: 'Router đọc địa chỉ IP đích để định tuyến liên mạng. Địa chỉ IP đầu-cuối được giữ nguyên xuyên suốt tuyến (nếu không NAT).',
      },
      {
        id: 'osi-l2',
        shortTag: 'L2..L1',
        label: 'Data Link & Physical',
        name: 'Frame (MAC + FCS) → Bits',
        value: 'PDU: Frame → Bits',
        protocolPrompt: 'arp -a && ethtool -S eth0',
        telemetry: [
          { key: 'PDU', value: 'Frame → Bit Stream' },
          { key: 'SRC MAC', value: '00:1A:2B:3C:4D:5E' },
          { key: 'SCOPE', value: 'Hop-by-Hop Switch' },
        ],
        code: `Ethernet II (L2): Src 00:1A:2B:3C:4D:5E -> Dst AA:BB:CC:DD:EE:01\nTrailer: FCS CRC-32 = 0x7E4B91C2 [Verified]\nPhysical (L1): 1000BASE-SX Fiber -> 10110010...`,
        note: 'Switch chuyển Frame dựa trên bảng MAC trong cùng LAN (đổi MAC qua mỗi chặng Router); Tầng 1 chuyển Frame thành chuỗi bit tín hiệu.',
      },
    ],
  },
  'ch-4': {
    number: '04',
    alias: 'Protocol Commander',
    sector: 'Sector 04 // TCP/IP Grid',
    color: 'var(--ch-4)',
    rgb: 'var(--ch-4-rgb)',
    mode: 'handshake-cidr',
    stageBadge: 'TCP SEQUENCE + IPv4 CIDR /26',
    inspectorTitle: 'TCP 3-Way Handshake & IPv4 CIDR Lab',
    coreTitle: 'SYN → SYN-ACK → ACK',
    coreSub: '2^(32 - prefix) - 2 Usable Hosts',
    layers: [
      {
        id: 'tcp-syn',
        shortTag: 'STEP 1',
        label: 'Client → Server [SYN]',
        name: '1. SYN (Synchronize)',
        value: 'SYN=1 · seq=1000',
        protocolPrompt: 'tcpdump -nn -i eth0 "tcp[tcpflags] & tcp-syn != 0"',
        telemetry: [
          { key: 'DIRECTION', value: 'Client → Server' },
          { key: 'FLAGS', value: '[S] SYN=1' },
          { key: 'SEQ', value: '1000' },
        ],
        code: `10:15:01.001 IP 192.168.10.12.51422 > 192.168.10.2.443:\n  Flags [S], seq 1000, win 64240, options [mss 1460], length 0`,
        note: 'Client chủ động gửi cờ SYN kèm Sequence Number ban đầu (ISN=1000) để đề nghị thiết lập kết nối tin cậy.',
      },
      {
        id: 'tcp-synack',
        shortTag: 'STEP 2',
        label: 'Server → Client [SYN-ACK]',
        name: '2. SYN-ACK (Acknowledge)',
        value: 'SYN=1, ACK=1 · ack=1001',
        protocolPrompt: 'ss -tan state syn-recv',
        telemetry: [
          { key: 'DIRECTION', value: 'Server → Client' },
          { key: 'FLAGS', value: '[S.] SYN+ACK' },
          { key: 'SEQ / ACK', value: '5000 / 1001' },
        ],
        code: `10:15:01.004 IP 192.168.10.2.443 > 192.168.10.12.51422:\n  Flags [S.], seq 5000, ack 1001, win 65160, length 0`,
        note: 'Server chấp nhận mở phiên, xác nhận đã nhận gói SYN (ack = 1000 + 1) và gửi Sequence Number riêng của mình (5000).',
      },
      {
        id: 'tcp-ack',
        shortTag: 'STEP 3',
        label: 'Client → Server [ACK]',
        name: '3. ACK (Established)',
        value: 'ACK=1 · ack=5001',
        protocolPrompt: 'ss -tan state established',
        telemetry: [
          { key: 'DIRECTION', value: 'Client → Server' },
          { key: 'STATE', value: 'ESTABLISHED' },
          { key: 'ACK', value: '5001' },
        ],
        code: `10:15:01.006 IP 192.168.10.12.51422 > 192.168.10.2.443:\n  Flags [.], ack 5001, win 502, length 0\n# Full-duplex TCP stream ready (FIN/ACK used on close)`,
        note: 'Client xác nhận ack=5001, hoàn tất bắt tay 3 bước và chuyển sang trạng thái ESTABLISHED để truyền dữ liệu song công.',
      },
      {
        id: 'ip-cidr',
        shortTag: 'CIDR /26',
        label: '192.168.10.0/26 Block',
        name: 'IPv4 /26 Subnetting',
        value: '62 Usable Hosts',
        protocolPrompt: 'ipcalc 192.168.10.0/26',
        telemetry: [
          { key: 'NETMASK', value: '255.255.255.192' },
          { key: 'USABLE', value: '.1 → .62 (62 hosts)' },
          { key: 'BROADCAST', value: '192.168.10.63' },
        ],
        code: `Address:   192.168.10.0/26\nNetmask:   255.255.255.192 = 26  (11111111.11111111.11111111.11000000)\nNetwork:   192.168.10.0     | HostMin: 192.168.10.1\nHostMax:   192.168.10.62    | Broadcast: 192.168.10.63\nHosts/Net: 2^(32-26) - 2 = 62`,
        note: 'Với prefix /26 (còn 6 bit host), có 64 địa chỉ: bỏ .0 (Network ID) và .63 (Broadcast), còn lại 62 địa chỉ hợp lệ cho Host.',
      },
    ],
  },
  'ch-5': {
    number: '05',
    alias: 'Zero-Day Guardian',
    sector: 'Sector 05 // Cyber Citadel',
    color: 'var(--ch-5)',
    rgb: 'var(--ch-5-rgb)',
    mode: 'security-perimeter',
    stageBadge: 'DEFENSE-IN-DEPTH GATEWAY',
    inspectorTitle: 'Defense-in-Depth Security Gateway',
    coreTitle: 'CIA + TLS + IPS + DAI',
    coreSub: 'Confidentiality • Integrity • Availability',
    layers: [
      {
        id: 'sec-tls',
        shortTag: 'GATE 1 · L7',
        label: 'HTTPS / TLS 1.3 + CA',
        name: 'L7 TLS & PKI Verification',
        value: 'Blocks MitM',
        protocolPrompt: 'openssl s_client -connect netwiz.edu:443 -tls1_3',
        telemetry: [
          { key: 'THREAT', value: 'Man-in-the-Middle' },
          { key: 'CIPHER', value: 'TLS_AES_256_GCM' },
          { key: 'ACTION', value: 'Verify X.509 Chain' },
        ],
        code: `SSL-Session: Protocol: TLSv1.3  Cipher: TLS_AES_256_GCM_SHA384\nVerify return code: 0 (ok - Trusted Root CA)\n# Prevents eavesdropping & server impersonation`,
        note: 'Mã hóa đầu-cuối và xác thực chứng thư số X.509 qua Trusted CA giúp ngăn nghe lén và giả mạo Man-in-the-Middle.',
      },
      {
        id: 'sec-fw',
        shortTag: 'GATE 2 · L4',
        label: 'Stateful Firewall + IPS',
        name: 'L4 Stateful Firewall & IPS',
        value: 'Blocks SYN Flood / Exploit',
        protocolPrompt: 'show firewall state-table && show ips stats',
        telemetry: [
          { key: 'THREAT', value: 'SYN Flood / Malware' },
          { key: 'ENGINE', value: 'Inline IPS + State' },
          { key: 'ACTION', value: 'Drop Anomalies' },
        ],
        code: `FW# show conn count -> 1,420 active state entries\nIPS# signature SID:202491 [SYN-Flood] -> ACTION: INLINE DROP\n# Tracks session state & blocks malicious payloads inline`,
        note: 'Stateful Firewall theo dõi bảng trạng thái kết nối hợp lệ; IPS đứng trực tiếp trên đường truyền để chặn gói tin khớp chữ ký tấn công.',
      },
      {
        id: 'sec-dai',
        shortTag: 'GATE 3 · L2',
        label: 'Switch DAI + DHCP Snoop',
        name: 'L2 Dynamic ARP Inspection',
        value: 'Blocks ARP Spoofing',
        protocolPrompt: 'SW1# show ip arp inspection vlan 10',
        telemetry: [
          { key: 'THREAT', value: 'ARP Spoofing' },
          { key: 'BINDING', value: 'DHCP Snooping DB' },
          { key: 'ACTION', value: 'Drop Forged ARP' },
        ],
        code: `SW1(config)# ip dhcp snooping vlan 10\nSW1(config)# ip arp inspection vlan 10\n%SW_DAI-4-DHCP_SNOOPING_DENY: Invalid ARP on Gi0/4 -> DROPPED`,
        note: 'Dynamic ARP Inspection đối chiếu mọi gói ARP với bảng DHCP Snooping để chặn kẻ tấn công giả mạo MAC/IP trong mạng LAN.',
      },
      {
        id: 'sec-cia',
        shortTag: 'CORE · CIA',
        label: 'Protected Core Zone',
        name: 'CIA Triad Enforcement',
        value: 'Confidentiality · Integrity · Availability',
        protocolPrompt: 'sec-audit --verify cia-triad',
        telemetry: [
          { key: 'CONFIDENTIALITY', value: 'AES-256 / TLS' },
          { key: 'INTEGRITY', value: 'HMAC-SHA256' },
          { key: 'AVAILABILITY', value: 'Rate-Limit / HA' },
        ],
        code: `[PASS] Confidentiality : Encrypted channels enforced\n[PASS] Integrity       : HMAC-SHA256 signatures verified\n[PASS] Availability    : DDoS rate-limit & failover active`,
        note: 'Ba trụ cột an toàn thông tin kết hợp cùng các lớp phòng thủ từ L7 xuống L2 giúp bảo vệ bí mật, toàn vẹn và tính sẵn sàng của hạ tầng.',
      },
    ],
  },
};
